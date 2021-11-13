package main

import (
	"context"
	"encoding/json"
	"syscall/js"

	"github.com/algorand/go-algorand-sdk/client/v2/common"
	"github.com/algorand/go-algorand-sdk/client/v2/indexer"
)

const indexerAddress = "https://testnet-algorand.api.purestake.io/idx2"
const indexerToken = "SxyeYnXjIi7sydMnmi85L8mqXypdroBv1ZdTcBmp"
const psTokenKey = "X-API-Key"
const appId = 33759957

type accountInfo struct {
	Registered bool
	Url        string
}

func getAccountInfo(this js.Value, arg []js.Value) interface{} {
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

			accInfo := accountInfo{false, ""}
			// registered := false
			for _, state := range result.AppsLocalState {
				if state.Id == appId && state.Deleted == false {
					accInfo.Registered = true
					asset := state.KeyValue[0].Value.Uint
					if accInfo.Registered {
						_, assetInfo, err := indexerClient.LookupAssetByID(asset).Do(context.Background())

						if err != nil {
							// Handle error
							errorConstructor := js.Global().Get("Error")
							errorObject := errorConstructor.New(err.Error())
							reject.Invoke(errorObject)
							return
						}

						accInfo.Url = assetInfo.Params.Url
					}
				}
			}

			e, _ := json.Marshal(accInfo)
			resolve.Invoke(js.ValueOf(string(e)))
		}()

		return nil
	})
	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(handler)
}

func main() {
	c := make(chan struct{}, 0)

	js.Global().Set("getAccountInfo", js.FuncOf(getAccountInfo))

	<-c
}
