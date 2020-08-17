@echo off
color 0a
title Task creator
set /p downvoterlocation="Please enter the location of the downvoter.js file: "
echo SCHTASKS /CREATE /SC MONTHLY /TN "MyTasks\reddit-downvoter-task" /TR "C:\Windows\System32\cmd.exe /k node %downvoterlocation%\downvoter.js" /ST 17:00 /D 1 > taskassistant.bat
echo Creating task...
start taskassistant.bat
ping 127.0.0.1 -n 3 > nul
echo Task created!
del taskassistant.bat
pause
exit