$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$destination = Join-Path $projectRoot 'output/characters/pose-studies'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$generatedRoot = 'C:\Users\KOCK MING TAI\.codex\generated_images\01a111e0-0987-7ee3-8d3d-9bd848ba156f'
$files = @{
    'mochi-poses-v1.png' = 'exec-643428b2-5bf1-4536-9ec3-8dbe580e931c.png'
    'chonk-poses-v1.png' = 'exec-c4182093-a1ad-4a86-8948-bcfc928931d6.png'
}
Add-Type -AssemblyName System.Drawing
foreach ($name in $files.Keys) {
    $target = Join-Path $destination $name
    Copy-Item -LiteralPath (Join-Path $generatedRoot $files[$name]) -Destination $target -Force
    $bitmap = [Drawing.Bitmap]::FromFile($target)
    try {
        Write-Output "$name : $($bitmap.Width)x$($bitmap.Height), $($bitmap.PixelFormat)"
        foreach ($point in @(@(0,0), @(768,512), @(800,40), @(100,40))) {
            Write-Output "Pixel $($point -join ','): $($bitmap.GetPixel($point[0],$point[1]).ToString())"
        }
    } finally { $bitmap.Dispose() }
}
