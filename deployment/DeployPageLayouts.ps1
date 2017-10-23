Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = "."
)

$LogFilePath = "$RootLocation\DeployPageLayoutsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Page Layout Name
#------------------------------------------------------------------

$PageLayoutName = "SpReactJsClient"

#------------------------------------------------------------------
#                        Deploying Page Layouts
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

    Write-Host -ForegroundColor Green "Adding PageLayout: $PageLayoutName"

    $ArticlePageContentType = Get-PnPContentType -Identity "Article Page"
    Add-PnPHtmlPublishingPageLayout -SourceFilePath "$RootLocation\Pagelayouts\$PageLayoutName.html" -Title "$PageLayoutName Page Layout" -Description "$PageLayoutName Page Layout" -DestinationFolderHierarchy "/" -AssociatedContentTypeID $ArticlePageContentType.Id

    Write-Host -ForegroundColor Green "PageLayout was added"

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}

