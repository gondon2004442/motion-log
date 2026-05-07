# Video Optimization for Frame Scrub

This project supports two source folders:

- `public/animations_optimized` (preferred)
- `public/animations` (fallback)

If optimized videos exist, the site uses them automatically.

## 1) Install FFmpeg on Windows

### Option A: winget (fastest)

```powershell
winget install -e --id Gyan.FFmpeg
```

Close and reopen terminal, then verify:

```powershell
ffmpeg -version
ffprobe -version
```

### Option B: manual install

1. Download FFmpeg build from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/).
2. Unzip to `C:\ffmpeg`.
3. Add `C:\ffmpeg\bin` to your Windows PATH.
4. Reopen terminal and run:

```powershell
ffmpeg -version
ffprobe -version
```

## 2) Run optimization

From project root:

```powershell
.\scripts\optimize-videos.bat ultra
```

Profiles:

- `ultra`: best scrub smoothness, largest files (`-g 1`)
- `balanced`: smaller files, still smooth (`-g 12`)

Example:

```powershell
.\scripts\optimize-videos.bat balanced
```

## 3) Validate files

Compare file sizes:

```powershell
Get-ChildItem .\public\animations,.\public\animations_optimized -Filter *.mp4 |
Select-Object Directory,Name,@{n='MB';e={[math]::Round($_.Length/1MB,2)}}
```

Check GOP and frame metadata for one file:

```powershell
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,avg_frame_rate,r_frame_rate,nb_frames -of default=noprint_wrappers=1:nokey=0 .\public\animations_optimized\Add_widget.mp4
```

## 4) Browser check

1. Open `http://localhost:3000`
2. Hard refresh (`Ctrl+F5`)
3. Move cursor left to right over each iPhone video.
4. If needed, run `ultra` profile for final export.
