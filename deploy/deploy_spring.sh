#!/usr/bin/env bash
set -euo pipefail
source deploy/config.conf

# ensure JAVA_HOME is valid/accessible and java is on PATH
if [ -n "${JAVA_HOME:-}" ] && [ ! -x "$JAVA_HOME/bin/java" ]; then
  echo "WARN: JAVA_HOME is set but not usable: $JAVA_HOME (falling back to system java)" >&2
  unset JAVA_HOME
fi
if [ -z "${JAVA_HOME:-}" ]; then
  export JAVA_HOME="$(dirname "$(dirname "$(readlink -f "$(command -v java)")")")"
fi
export PATH="$JAVA_HOME/bin:$PATH"

ROOT_PASSWORD="${ROOT_PASSWORD:?missing ROOT_PASSWORD}"
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

echo "== Build Spring =="
mvn -q -f spring/pom.xml clean package -DskipTests

JAR="$(ls spring/target/*.jar | grep -v plain | head -n 1)"
echo "Jar: $JAR"

echo "== Copy jar to server =="
sshpass -p "$ROOT_PASSWORD" scp $SSH_OPTS "$JAR" "root@${WEB_SERVER_IP}:${SPRING_REMOTE_JAR}"

echo "== Restart JAVA =="
sshpass -p "$ROOT_PASSWORD" ssh $SSH_OPTS "root@${WEB_SERVER_IP}" "\
  set -e; \
  mkdir -p \"$(dirname "${SPRING_REMOTE_JAR}")\"; \
  pgrep -f \"java.*${SPRING_REMOTE_JAR}\" >/dev/null 2>&1 && pkill -f \"java.*${SPRING_REMOTE_JAR}\" || true; \
  nohup /usr/bin/java -jar \"${SPRING_REMOTE_JAR}\" > /var/log/${SPRING_SERVICE}.log 2>&1 & \
  sleep 1; \
  pgrep -f \"java.*${SPRING_REMOTE_JAR}\" >/dev/null; \
  echo \"OK: started\"; \
  tail -n 25 /var/log/${SPRING_SERVICE}.log || true \
"

echo "✅ Spring deployed"
