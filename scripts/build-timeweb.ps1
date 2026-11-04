<#
  Сборка сайта для хостинга Timeweb.

  Запуск из корня проекта:
    .\scripts\build-timeweb.ps1 -Domain coolprint-spb.ru

  Что делает: собирает проект с адресом вашего домена (canonical, Open Graph, robots.txt, sitemap.xml),
  убирает файлы, нужные только Cloudflare, и кладёт результат в папку timeweb\site и архив timeweb\site.zip.
  Содержимое архива нужно распаковать прямо в public_html домена на хостинге.
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Domain
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# Принимаем и «example.ru», и «https://example.ru/»
$Domain = ($Domain.Trim().ToLower() -replace '^https?://', '') -replace '/.*$', ''
if ($Domain -notmatch '^[a-z0-9.-]+\.[a-z0-9-]{2,}$') { throw "Не похоже на домен: '$Domain'" }

# Переменная окружения важнее значения из .env
$env:VITE_SITE_URL = "https://$Domain/"

npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Сборка завершилась с ошибкой' }

$out = Join-Path $root 'timeweb'
$site = Join-Path $out 'site'
$zip = Join-Path $out 'site.zip'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Path $site | Out-Null

Copy-Item (Join-Path $root 'dist\*') $site -Recurse -Force
foreach ($name in 'wrangler.json', '.assetsignore') {
  $path = Join-Path $site $name
  if (Test-Path $path) { Remove-Item $path -Force }
}

# Архив собираем вручную: Compress-Archive и ZipFile в Windows PowerShell 5.1 пишут пути с обратными слэшами,
# и Linux-хостинг распаковал бы их как файлы вида «assets\index.js» в корне
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open($zip, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  $prefix = (Resolve-Path $site).Path.TrimEnd('\') + '\'
  Get-ChildItem $site -Recurse -File -Force | ForEach-Object {
    $entryName = $_.FullName.Substring($prefix.Length).Replace('\', '/')
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal)
  }
} finally {
  $archive.Dispose()
}
$sizeMb = [math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Host ''
Write-Host "Готово. Домен: https://$Domain/" -ForegroundColor Green
Write-Host "Архив: $zip ($sizeMb МБ)"
Write-Host 'Распакуйте его содержимое в public_html вашего домена на Timeweb (подробно: TIMEWEB.md).'
