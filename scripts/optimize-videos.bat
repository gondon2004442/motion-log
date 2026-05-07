@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

set "ROOT=%~dp0.."
set "IN_DIR=%ROOT%\public\animations"
set "OUT_DIR=%ROOT%\public\animations_optimized"
set "FFMPEG_EXE=ffmpeg"

if "%~1"=="" (
  set "PROFILE=ultra"
) else (
  set "PROFILE=%~1"
)

where ffmpeg >nul 2>&1
if errorlevel 1 (
  if exist "%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe" (
    set "FFMPEG_EXE=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe"
  ) else (
    echo [ERROR] ffmpeg not found in PATH.
    echo Install FFmpeg and reopen terminal, then run this script again.
    exit /b 1
  )
)

if not exist "%IN_DIR%" (
  echo [ERROR] Input folder not found: "%IN_DIR%"
  exit /b 1
)

if not exist "%OUT_DIR%" mkdir "%OUT_DIR%"

if /I "%PROFILE%"=="ultra" (
  set "FF_ARGS=-c:v libx264 -preset medium -crf 18 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart -an"
) else if /I "%PROFILE%"=="balanced" (
  set "FF_ARGS=-c:v libx264 -preset medium -crf 20 -g 12 -keyint_min 12 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart -an"
) else (
  echo [ERROR] Unknown profile "%PROFILE%". Use "ultra" or "balanced".
  exit /b 1
)

echo Input folder : %IN_DIR%
echo Output folder: %OUT_DIR%
echo Profile      : %PROFILE%
echo FFmpeg       : %FFMPEG_EXE%
echo.

for %%F in ("%IN_DIR%\*.mp4") do (
  echo Processing %%~nxF
  "%FFMPEG_EXE%" -y -i "%%~fF" !FF_ARGS! "%OUT_DIR%\%%~nF.mp4"
  if errorlevel 1 (
    echo [ERROR] Failed to process %%~nxF
    exit /b 1
  )
)

echo.
echo Done. Optimized files are in:
echo %OUT_DIR%
echo.
echo To compare size:
echo powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem '%IN_DIR%' , '%OUT_DIR%' -Filter *.mp4 ^| Select-Object Directory,Name,@{n='MB';e={[math]::Round($_.Length/1MB,2)}}"

endlocal
