##############
##  Variables
##############
$siteUrl
$appId
$appSecret
$packageName
$packagePath


##############
##  Build app
##############
gulp clean
gulp bundle --ship
gulp package solution --ship


##############
##  Connect and add app
##############
Connect-PnPOnline -Url $siteUrl -AppId "$appId" -AppSecret "$appSecret"
Write-Host "=-=-=-=-"
Write-Host "Connected to $siteUrl."
Write-Host "=-=-=-=-"

$package = Add-PnPApp -Path $packagePath/$packageName.sppkg -Scope Site -Overwrite -Publish

Write-Host "=-=-=-=-"
Write-Host "$packageName.sppkg added to $siteUrl."
Write-Host "=-=-=-=-"


##############
##  Clear recycle bin
##############
$recycledItems = Get-PnPRecycleBinItem | ? Title -Like "$packageName*"

if ($recycledItems) {
    $recycledItems | Clear-PnPRecycleBinItem -Force
    Write-Host "=-=-=-=-"
    Write-Host "$siteUrl recycle bins cleared."
    Write-Host "=-=-=-=-"
}


##############
##  Install app
##############
function IsUninstalled {
    $applicationCheck = Get-PnPApp -Identity $package.Id -Scope Site
    if ($applicationCheck.InstalledVersion) {
        Write-Host "The $packageName package is still here"
        IsUninstalled
    }
    else {
        Write-Host "The $packageName package is now gone"
    }
}

$application = Get-PnPApp -Identity $package.Id -Scope Site

if ($application.InstalledVersion) {
    if ($application.InstalledVersion -GE $application.AppCatalogVersion) {
        Write-Host "`nThe $packageName package is already installed in the site with the same or higher version and will be reinstalled.`n"
        Uninstall-PnPApp -Identity $package.Id -Scope Site
        IsUninstalled
        Install-PnPApp -Identity $package.Id -Scope Site
    }
    else {
        Write-Host "`nThe $packageName package is already installed in the site with a higher version available which will be installed.`n"
        Update-PnPApp -Identity $package.Id -Scope Site
    }
}
else {
    Write-Host "`nThe $packageName package is not installed in the site but it will be.`n"
    Install-PnPApp -Identity $package.Id -Scope Site
}