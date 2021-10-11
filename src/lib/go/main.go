package main

import (
	"syscall/js"
)

func addFunction(this js.Value, p []js.Value) interface{} {
	sum := p[0].Int() + p[1].Int()
	return js.ValueOf(sum)
}

func main() {
	c := make(chan struct{}, 0)

	js.Global().Set("add", js.FuncOf(addFunction))

	<-c
}
