Function CreateData([string]$inputFile, [string]$RootLocation, [string]$SubSite, [bool]$recreate, [bool]$debug) {

    $logFilePath = "$RootLocation\CreateDataLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        Write-Host -ForegroundColor Green "Creating data..."

        $web = ''

        if($SubSite) {
            $web = Get-PnPWeb -Identity $SubSite
        } 
        else {
            $web = Get-PnPWeb
        }

        $inputDoc = [xml](Get-Content $inputFile)
        $data = $inputDoc.Data

        foreach($list in $data.List) {
            $listName = $list.Name

            Write-Host -ForegroundColor Green "Trying to create data for list $listName"

            $isExist = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue -Web $web

            if($isExist -ne $null) {
                Write-Host -ForegroundColor Green "List $listName found"

                $rows = $list.Rows

                foreach($row in $rows.Row) {
                    $values = @{}
                    
                    foreach($field in $row.Field) {
                        $value = ''

                        if ($field.Type -eq 'Text') {
                            $value = $field.Value
                        }

                        if ($field.Type -eq 'Choice') {
                            $value = $field.Value
                        }
                        
                        if ($field.Type -eq 'LookupMulti') {
                            $lookUpValues = $field.Value.Split(';')
                            $arrayOfValues = @()

                            foreach($lookUpValue in $lookUpValues) {
                                $query = "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>" + $lookUpValue + "</Value></Eq></Where></Query></View>"
                                $item = Get-PnPListItem -List $field.List -Query $query

                                if ($item -ne $null) {
                                    $arrayOfValues += $item.ID
                                }
                            }

                            $value = $arrayOfValues
                        }

                        $values.Add($field.Name, $value)
                    }

                    Write-Host -ForegroundColor DarkYellow ($values | Out-String)

                    Add-PnPListItem -List $listName -ContentType "Item" -Values $values -Web $web
                }

                if($debug) {
                    Write-Host -ForegroundColor DarkYellow $list.OuterXml
                }

                Write-Host -ForegroundColor Green "Data created for list $listName"
            } 
        }

        Write-Host -ForegroundColor Green "Data created"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}