@echo off
setlocal
set MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6
set MVN_CMD=%MAVEN_HOME%\bin\mvn.cmd
if not exist "%MVN_CMD%" (
    echo Downloading Maven 3.9.6...
    mkdir "%MAVEN_HOME%" 2>nul
    curl -fsSL "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -o "%TEMP%\maven.zip"
    powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force"
    del "%TEMP%\maven.zip"
)
"%MVN_CMD%" %*
