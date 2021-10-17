REM del ./build/*.wasm >nul

set GOPATH=C:\Users\Dylan\go
set GOOS=js
set GOARCH=wasm
go build -o ./build/desocial.wasm main.go