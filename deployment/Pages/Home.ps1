Param (
	[Parameter(Mandatory = $true)]
	[string]$SiteUrl,
	[Parameter(Mandatory = $true)]
	[string]$SPWebServerRelativeUrl,
	[string]$Credential,
	[string]$RootLocation,
	[string]$ProjectFolderName
)

$LogFilePath = "$RootLocation\PageLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Page Name
#------------------------------------------------------------------

$PageName = "Home"
$PageLayoutName = "SpReactJsClient"

#------------------------------------------------------------------
#                        Deploying Page
#------------------------------------------------------------------

Try {
	Add-PnPPublishingPage -PageName $PageName -Title $PageName -PageTemplateName $PageLayoutName

	$Page = '<?xml version="1.0" encoding="utf-8"?>
				<WebPart xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/WebPart/v2">
					<Title>Content Editor</Title>
					<FrameType>None</FrameType>
					<Description>Allows authors to enter rich text content.</Description>
					<IsIncluded>true</IsIncluded>
					<ZoneID>Hero</ZoneID>
					<PartOrder>0</PartOrder>
					<FrameState>Normal</FrameState>
					<Height />
					<Width />
					<AllowRemove>true</AllowRemove>
					<AllowZoneChange>true</AllowZoneChange>
					<AllowMinimize>true</AllowMinimize>
					<AllowConnect>true</AllowConnect>
					<AllowEdit>true</AllowEdit>
					<AllowHide>true</AllowHide>
					<IsVisible>true</IsVisible>
					<DetailLink />
					<HelpLink />
					<HelpMode>Modeless</HelpMode>
					<Dir>Default</Dir>
					<PartImageSmall />
					<MissingAssembly>Cannot import this Web Part.</MissingAssembly>
					<PartImageLarge>/_layouts/15/images/mscontl.gif</PartImageLarge>
					<IsIncludedFilter />
					<Assembly>Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c</Assembly>
					<TypeName>Microsoft.SharePoint.WebPartPages.ContentEditorWebPart</TypeName>
					<ContentLink xmlns="http://schemas.microsoft.com/WebPart/v2/ContentEditor">' + $SPWebServerRelativeUrl + '/Style Library/' + $ProjectFolderName + '/templates/' + $PageName + '.html</ContentLink>
					<Content xmlns="http://schemas.microsoft.com/WebPart/v2/ContentEditor" />
					<PartStorage xmlns="http://schemas.microsoft.com/WebPart/v2/ContentEditor" />
				</WebPart>'

	$PageUrl = "$SPWebServerRelativeUrl/Pages/$PageName.aspx"

	Set-PnPFileCheckedOut -Url $PageUrl

	Add-PnPWebPartToWebPartPage -ServerRelativePageUrl $PageUrl -XML $Page -ZoneId "Hero" -ZoneIndex 0

	Set-PnPFileCheckedIn -Url $PageUrl -CheckinType MajorCheckIn -Comment "Added webpart to the page"

	Set-PnPHomePage -RootFolderRelativeUrl "Pages/$PageName.aspx"
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}
