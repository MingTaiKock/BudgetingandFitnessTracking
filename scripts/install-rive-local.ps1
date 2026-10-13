param([switch]$Offline)
$ErrorActionPreference = 'Stop'
$version = '1.5.0'
$expectedHash = '12ea8a713642887150e25414acca6b219645b7a60ae1aa708fe17b3d8b2b6761'
$projectRoot = Split-Path -Parent $PSScriptRoot
$toolHome = Join-Path $projectRoot '.tools/rive'
$downloadDir = Join-Path $projectRoot '.tools/downloads'
$archive = Join-Path $downloadDir "rive-windows-x64-$version.tar.gz"
$versionDir = Join-Path $toolHome "versions/$version"
$binDir = Join-Path $toolHome 'bin'
if (-not [Environment]::Is64BitOperatingSystem) { throw 'Rive requires Windows x64.' }
New-Item -ItemType Directory -Force -Path $downloadDir, $versionDir, $binDir | Out-Null
if (-not (Test-Path -LiteralPath $archive)) {
    if ($Offline) { throw "Missing archive: $archive" }
    & curl.exe -L --fail --connect-timeout 15 --max-time 120 "https://releases.rive.app/cli/v$version/rive-windows-x64.tar.gz" -o $archive
    if ($LASTEXITCODE -ne 0) { throw 'Official release download failed.' }
}
$hasher = [Security.Cryptography.SHA256]::Create()
$archiveStream = [IO.File]::OpenRead($archive)
try { $actualHash = ([BitConverter]::ToString($hasher.ComputeHash($archiveStream))).Replace('-', '').ToLowerInvariant() }
finally { $archiveStream.Dispose(); $hasher.Dispose() }
if ($actualHash -ne $expectedHash) { throw 'Release archive SHA-256 mismatch; nothing extracted.' }
$tar = Join-Path $env:SystemRoot 'System32/tar.exe'
$members = @(& $tar -tzf $archive)
if ($LASTEXITCODE -ne 0) { throw 'Cannot list archive.' }
foreach ($member in $members) {
    if ($member.StartsWith('/') -or $member -match '(^|/)\.\.(/|$)|\\|:') { throw "Unsafe archive path: $member" }
}
if ($members -notcontains 'rive.exe') { throw 'Archive has no rive.exe.' }
# Extract only the official binary and bundled reference material. No PATH changes or deletion.
foreach ($entry in @('rive.exe', 'docs', 'samples')) {
    if (@($members | Where-Object { $_ -eq $entry -or $_.StartsWith("$entry/") }).Count -gt 0) {
        & $tar -xzf $archive -C $versionDir -- $entry
        if ($LASTEXITCODE -ne 0) { throw "Extraction failed: $entry" }
    }
}
Copy-Item -LiteralPath (Join-Path $versionDir 'rive.exe') -Destination (Join-Path $binDir 'rive.exe') -Force
$utf8 = New-Object System.Text.UTF8Encoding($false)
foreach ($name in @('current', 'default')) { [IO.File]::WriteAllText((Join-Path $toolHome $name), "$version`n", $utf8) }
[IO.File]::WriteAllText((Join-Path $toolHome 'stream'), "stable`n", $utf8)
Write-Output "Installed Rive $version locally: $binDir"
Write-Output "Verified SHA-256: $actualHash"
