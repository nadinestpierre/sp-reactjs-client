Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$SPWebServerRelativeUrl, 
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = "."
)

$LogFilePath = "$RootLocation\DeployPagesLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Project Folder Name
#------------------------------------------------------------------

$ProjectFolderName = "spreactjsclient"

#------------------------------------------------------------------
#                        Deploying Pages
#------------------------------------------------------------------

Try {
    Write-Host -ForegroundColor Green "Connecting to site $SiteUrl$SubSite"
    
    if($Credential) {
        Connect-PnPOnline -Url $SiteUrl -Credentials $Credential
    } 
    else {
        Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    }

    Write-Host -ForegroundColor Green "Connected"

    Write-Host -ForegroundColor Green "Adding Pages"

    & "$RootLocation\Pages\Home.ps1" -SiteUrl $SiteUrl -SPWebServerRelativeUrl $SPWebServerRelativeUrl -Credential $Credential -RootLocation $RootLocation -ProjectFolderName $ProjectFolderName 

    Write-Host -ForegroundColor Green "Pages were added"

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}