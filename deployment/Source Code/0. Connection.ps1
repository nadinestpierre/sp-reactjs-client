Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$Credential,
    [string]$RootLocation = "."
)

$LogFilePath = "$RootLocation\ConnectionLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Connecting to site
#------------------------------------------------------------------

Try {
    Write-Host "Connecting to site" -ForegroundColor Green
    
    if($Credential) {
        Connect-PnPOnline -Url $SiteUrl -Credentials $Credential
    } 
    else {
        Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    }

    Write-Host "Connected" -ForegroundColor Green
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}