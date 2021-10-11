cd ./src/lib/go/
call build.bat
cd ../../../

cd ./public
del *.wasm
cd ..

xcopy /s "./src/lib/go/build" "./public"

npm run serve