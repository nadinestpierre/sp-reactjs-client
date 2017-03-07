﻿Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\DeployMasterPageLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Master Page
#------------------------------------------------------------------

Try {
    Connect-SPOnline -Url $SiteUrl -Credentials $Credential

    Add-SPOMasterPage -SourceFilePath "$RootLocation\Masterpage\dove-hair-casting.master" -Title "Dove Hair Casting" -Description "Dove Hair Casting" -DestinationFolderHierarchy "/"
    Set-SPOMasterPage -CustomMasterPageSiteRelativeUrl "_catalogs/masterpage/dove-hair-casting.master"

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}
