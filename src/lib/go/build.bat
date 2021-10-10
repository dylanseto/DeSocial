cd ./build
del *.wasm

set GOOS=js
set GOARCH=wasm
go build -o ./build/desocial.wasm