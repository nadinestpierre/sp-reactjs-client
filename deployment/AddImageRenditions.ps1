﻿Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = "."
)

$LogFilePath = "$RootLocation\AddImageRenditionsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Adding Image Renditions
#------------------------------------------------------------------

Try {
    Write-Host -ForegroundColor Green "Connecting to site $SiteUrl$SubSite"

    if($Credential) {
        Connect-PnPOnline -Url $SiteUrl -Credentials $Credential
    } 
    else {
        Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    }

    $web = ''

    if($SubSite) {
        $web = Get-PnPWeb -Identity $SubSite
    } 
    else {
        $web = Get-PnPWeb
    }

    Write-Host -ForegroundColor Green "Connected"

    Write-Host -ForegroundColor Green "Trying to add image rendition"

    Add-PnPPublishingImageRendition -Name "Agency Profile Photo" -Width 200 -Height -1 -Web $Web
    Add-PnPPublishingImageRendition -Name "Agency Photos" -Width 230 -Height -1 -Web $Web

    Write-Host -ForegroundColor Green "Image rendition was added"

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}