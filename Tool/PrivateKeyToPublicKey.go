package Tool

import (
	"encoding/hex"
	"fmt"
	"github.com/decred/dcrd/dcrec/secp256k1/v4"
)

func privKeyToPubKey(priKey string) (SerializeUncompressed, SerializeCompressed string) {
	// Example
	decodeString, err := hex.DecodeString("285de8d8e9b4dbc03715954a5fd38686ef920b6807f1aa993b2adaaa88215795")
	if err != nil {
		return
	}
	privKey := secp256k1.PrivKeyFromBytes(decodeString)
	fmt.Println(privKey.Key.String())
	SerializeUncompressed = hex.EncodeToString(privKey.PubKey().SerializeUncompressed())
	SerializeCompressed = hex.EncodeToString(privKey.PubKey().SerializeCompressed())
	return
}
