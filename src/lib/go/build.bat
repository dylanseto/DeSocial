del ./build/*.wasm >nul 2>&1

set GOPATH=C:\Users\Dylan\go
set GOOS=js
set GOARCH=wasm
go build -o ./build/testing.wasm main.go