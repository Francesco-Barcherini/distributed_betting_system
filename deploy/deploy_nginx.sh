#!/usr/bin/env bash
set -euo pipefail
source deploy/config.conf

ROOT_PASSWORD="${ROOT_PASSWORD:?missing ROOT_PASSWORD}"
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

LOCAL_CONF="nginx/betting.conf"
REMOTE_CONF="${NGINX_REMOTE_CONF}"
REMOTE_SITE_NAME="${NGINX_SITE_NAME}"

if [[ ! -f "${LOCAL_CONF}" ]]; then
  echo "Missing local nginx config: ${LOCAL_CONF}" >&2
  exit 1
fi

echo "== Copy nginx config to load balancer =="
sshpass -p "$ROOT_PASSWORD" scp $SSH_OPTS "${LOCAL_CONF}" "root@${LOAD_BALANCER_IP}:${REMOTE_CONF}"

echo "== Enable site (if needed) =="
sshpass -p "$ROOT_PASSWORD" ssh $SSH_OPTS "root@${LOAD_BALANCER_IP}" "\
  if [[ ! -e /etc/nginx/sites-enabled/${REMOTE_SITE_NAME} ]]; then
    ln -s ${REMOTE_CONF} /etc/nginx/sites-enabled/${REMOTE_SITE_NAME};
  fi
"

echo "== Stop nginx if running, test config, then start =="
sshpass -p "$ROOT_PASSWORD" ssh $SSH_OPTS "root@${LOAD_BALANCER_IP}" 'bash -s' <<'REMOTE'
set -euo pipefail

stop_nginx() {
  if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files | grep -q '^nginx\.service'; then
    systemctl is-active --quiet nginx && systemctl stop nginx || true
  else
    pgrep -x nginx >/dev/null 2>&1 && (nginx -s quit || pkill -x nginx || true) || true
  fi
}

start_nginx() {
  if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files | grep -q '^nginx\.service'; then
    systemctl start nginx
    systemctl --no-pager status nginx | head -n 25 || true
  else
    nginx
    pgrep -x nginx >/dev/null 2>&1
  fi
}

echo "Stopping nginx (if running)..."
stop_nginx

echo "Testing config..."
nginx -t

echo "Starting nginx..."
start_nginx

echo "OK"
REMOTE

echo "✅ Nginx deployed"
