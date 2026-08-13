@echo off
echo ===================================================
echo Khởi động n8n (Đã cap quyen vao thu muc yen-sao-site)
echo ===================================================
set N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=false
set N8N_RESTRICT_FILE_ACCESS_TO=D:/CODEs/tamthuy/yen-sao-site/src/data/posts/
npx n8n
pause
