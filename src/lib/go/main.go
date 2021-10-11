package main

import (
	"fmt"
	"syscall/js"
)

func addFunction(this js.Value, p []js.Value) interface{} {
	fmt.Println("a word 2")
	return js.ValueOf(1)
}

func main() {
	c := make(chan struct{}, 0)

	fmt.Println("a word 5")

	js.Global().Set("add", js.FuncOf(addFunction))

	<-c
}
