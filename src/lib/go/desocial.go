package desocial

import (
	"fmt"

	"github.com/algorand/go-algorand-sdk/client/algod"
)

func main() {
	algodClient, err := algod.MakeClient("", "")

	algodClient.Status()
	if err != nil {
		fmt.Printf("error getting algod status: %s\n", err)
		return
	}
	fmt.Println("wasm test")
}
