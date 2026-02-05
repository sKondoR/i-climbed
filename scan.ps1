# Read .env file and set environment variables
Get-Content .env | ForEach-Object {
    $name, $value = $_.split('=', 2)
    if ($name -and $value) {
        Set-Item env:$name $value
    }
}

# Run Sonar Scanner
npx sonar-scanner "-Dsonar.token=$env:SONAR_TOKEN"