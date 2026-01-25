#!/usr/bin/env bash
set -euo pipefail
source deploy/config.conf

ROOT_PASSWORD="${ROOT_PASSWORD:?missing ROOT_PASSWORD}"
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

echo "== Build Spring =="
mvn -q -f spring/pom.xml clean package -DskipTests

JAR="$(ls spring/target/*.jar | grep -v plain | head -n 1)"
echo "Jar: $JAR"

echo "== Copy jar to server =="
sshpass -p "$ROOT_PASSWORD" scp $SSH_OPTS "$JAR" "root@${WEB_SERVER_IP}:${SPRING_REMOTE_JAR}"

echo "== Restart service =="
sshpass -p "$ROOT_PASSWORD" ssh $SSH_OPTS "root@${WEB_SERVER_IP}" "\
  systemctl restart ${SPRING_SERVICE} && \
  systemctl --no-pager status ${SPRING_SERVICE} | head -n 25 \
"

echo "✅ Spring deployed"

