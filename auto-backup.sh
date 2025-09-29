#!/bin/bash

# 자동 백업 스크립트
# 사용법: ./auto-backup.sh

cd /Users/jhuny_mac/Develop/Link-Lite

# 현재 시간
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 변경사항이 있는지 확인
if git diff --quiet && git diff --cached --quiet; then
    echo "[$TIMESTAMP] No changes to backup"
    exit 0
fi

# 자동 백업 커밋
git add .
git commit -m "Auto backup - $TIMESTAMP"

# 깃허브에 푸시
if git push; then
    echo "[$TIMESTAMP] ✅ Backup successful"
else
    echo "[$TIMESTAMP] ❌ Backup failed"
fi
