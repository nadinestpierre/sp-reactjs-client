Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = "."
)

$LogFilePath = "$RootLocation\DeployMasterPageLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Master Page Name
#------------------------------------------------------------------

$masterPageName = "masterpage"

#------------------------------------------------------------------
#                        Deploying Master Page
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

    Write-Host -ForegroundColor Green "Adding MasterPage: $masterPageName"

    $masterPage = "$masterPageName.html"

    Add-PnPFile -Path "$RootLocation\MasterPage\$masterPage" -folder "_catalogs/masterpage" -Checkout -Web $Web

    $fileItem = Get-PnPFile -Url "_catalogs/masterpage/$masterPage" -AsListItem -Web $Web
    $fileItem.Update()
    $fileItem.File.Publish("")

    Write-Host -ForegroundColor Green "MasterPage was added"

    Set-PnPMasterPage -CustomMasterPageSiteRelativeUrl  "_catalogs/masterpage/$masterPageName.master" -Web $Web

    Write-Host -ForegroundColor Green "MasterPage was set up as default"

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}
