@echo off
chcp 65001 >nul

echo ===============================
echo   Git 自动更新远程仓库
echo ===============================

echo.
echo [0/5] 当前远程仓库：
git remote -v

echo.
echo [1/5] 当前分支：
git branch --show-current

echo.
echo [2/5] 添加所有修改...
git add .

echo.
echo [3/5] 检查是否有需要提交的修改...
git diff --cached --quiet
if %errorlevel%==0 (
    echo 没有需要提交的修改，退出。
    goto end
)

echo.
echo [4/5] 提交修改...
set now=%date% %time%
git commit -m "auto update %now%"

echo.
echo [5/5] 推送到远程仓库...
git pull --rebase
git push -u origin main

echo.
echo 🎉 完成！代码已同步到 GitHub

:end
pause
