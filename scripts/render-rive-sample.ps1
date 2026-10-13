$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$toolHome = Join-Path $projectRoot '.tools/rive'
$riveExe = Join-Path $toolHome 'bin/rive.exe'
$sceneDir = Join-Path $projectRoot 'animation/sample'
$outputDir = Join-Path $projectRoot 'output/characters/rive-sample'
$frameDir = Join-Path $outputDir 'frames'
New-Item -ItemType Directory -Path $frameDir -Force | Out-Null
$previousHome = $env:RIVE_HOME
try {
    $env:RIVE_HOME = $toolHome
    for ($index = 0; $index -lt 108; $index++) {
        $frameFile = Join-Path $frameDir ('frame-{0:D3}.png' -f $index)
        $seconds = (($index / 18.0) + (1.0 / 60.0)).ToString('0.000000', [Globalization.CultureInfo]::InvariantCulture)
        & $riveExe $sceneDir "--screenshot=$frameFile" "--advance=${seconds}s" --quiet
        if ($LASTEXITCODE -ne 0) { throw "Frame $index failed." }
        if ($index % 18 -eq 0) { Write-Output "Rendered $index / 108 frames" }
    }
} finally { $env:RIVE_HOME = $previousHome }
$inputPattern = Join-Path $frameDir 'frame-%03d.png'
$gif = Join-Path $outputDir 'mochi-chonk-sample.gif'
$mp4 = Join-Path $outputDir 'mochi-chonk-sample.mp4'
& ffmpeg -hide_banner -loglevel error -y -framerate 18 -i $inputPattern -filter_complex 'split[a][b];[a]palettegen=stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a' -loop 0 $gif
if ($LASTEXITCODE -ne 0) { throw 'GIF export failed.' }
& ffmpeg -hide_banner -loglevel error -y -framerate 18 -i $inputPattern -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart $mp4
if ($LASTEXITCODE -ne 0) { throw 'MP4 export failed.' }
& ffmpeg -hide_banner -loglevel error -y -framerate 18 -i $inputPattern -vf 'select=eq(n\,0)+eq(n\,24)+eq(n\,36)+eq(n\,72)+eq(n\,84)+eq(n\,107),scale=400:225,tile=3x2' -frames:v 1 (Join-Path $outputDir 'contact-sheet.png')
if ($LASTEXITCODE -ne 0) { throw 'Contact sheet export failed.' }
Write-Output $gif
Write-Output $mp4
