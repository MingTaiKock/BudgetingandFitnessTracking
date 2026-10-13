$project = Split-Path -Parent $PSScriptRoot
$chonk = Join-Path $project 'public/characters/chonk.png'
$mochi = Join-Path $project 'public/characters/mochi.png'
$output = Join-Path $project 'output/characters/mochi-chonk-nuzzle.gif'

$filter = "[0:v]scale=330:-1,format=rgba[ch];[1:v]scale=280:-1,format=rgba[mo];[2:v][ch]overlay=x='60+8*sin(2*PI*t/3)':y='75-3*sin(2*PI*t/3)':shortest=1[base];[base][mo]overlay=x='365-8*sin(2*PI*t/3)':y='135-3*sin(2*PI*t/3)':shortest=1,fps=18,split[a][b];[a]palettegen=reserve_transparent=0[p];[b][p]paletteuse=dither=bayer[out]"

& ffmpeg -hide_banner -loglevel error -y -loop 1 -framerate 18 -i $chonk -loop 1 -framerate 18 -i $mochi -f lavfi -i 'color=c=0xf3edf9:s=720x300:r=18:d=3' -filter_complex $filter -map '[out]' -t 3 -loop 0 $output
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Output $output
