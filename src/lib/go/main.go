package main

import (
	"context"
	"sync"
	"syscall/js"

	"github.com/algorand/go-algorand-sdk/client/v2/common"
	"github.com/algorand/go-algorand-sdk/client/v2/indexer"
)

const indexerAddress = "https://testnet-algorand.api.purestake.io/idx2"
const indexerToken = "SxyeYnXjIi7sydMnmi85L8mqXypdroBv1ZdTcBmp"
const psTokenKey = "X-API-Key"
const appId = 33467672

var wg sync.WaitGroup       // 1
var res = make(chan string) // Declare a unbuffered channel

func isRegistered(this js.Value, arg []js.Value) interface{} {
	accountID := arg[0].String()

	handler := js.FuncOf(func(this js.Value, p []js.Value) interface{} {
		resolve := p[0]
		reject := p[1]
		go func() {
			commonClient, _ := common.MakeClient(indexerAddress, psTokenKey, indexerToken)
			indexerClient := (*indexer.Client)(commonClient)
			_, result, err := indexerClient.LookupAccountByID(accountID).Do(context.Background())

			if err != nil {
				// Handle error
				errorConstructor := js.Global().Get("Error")
				errorObject := errorConstructor.New(err.Error())
				reject.Invoke(errorObject)
				return
			}

			registered := false
			for _, state := range result.AppsLocalState {
				if state.Id == appId {
					registered = true
				}
			}

			resolve.Invoke(js.ValueOf(registered))
		}()

		return nil
	})
	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(handler)
}

func main() {
	c := make(chan struct{}, 0)

	js.Global().Set("isRegistered", js.FuncOf(isRegistered))

	<-c
}
