@echo off
setlocal
echo ========================================================
echo    Nuzool-ul-Quran - GitHub & GitHub Pages Deployment
echo ========================================================
echo.

set PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%

where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not found in PATH.
    pause
    exit /b 1
)

echo Git is ready.
echo.

set /p REPO_URL="Apne GitHub Repository ka URL enter karein (e.g. https://github.com/USERNAME/nuzool-ul-quran.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL khali nahi ho sakta.
    pause
    exit /b 1
)

echo.
echo [1/3] Adding remote origin...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo [2/3] Renaming branch to main...
git branch -M main

echo [3/3] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] Code kamyabi se GitHub par push ho chuka hai!
    echo ========================================================
    echo.
    echo GitHub Pages activate karne ke liye:
    echo 1. Apne repo page par jayein: Settings ^> Pages
    echo 2. 'Build and deployment' ke Source mein 'Deploy from a branch' chunein
    echo 3. Branch mein 'main' aur folder '/ (root)' select karke Save karein.
    echo.
    echo Aapka portal 1-2 minute mein live ho jayega!
) else (
    echo.
    echo [ERROR] Push fail ho gaya. Barah-e-karam apna GitHub username/Personal Access Token check karein.
)

echo.
pause
