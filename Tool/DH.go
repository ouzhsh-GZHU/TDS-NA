package Tool

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"fmt"

	"github.com/decred/dcrd/dcrec/secp256k1/v4"
)

// cite https://github.com/decred/dcrd/tree/master/dcrec/secp256k1
func encrypt(toPubKey string, data string) (ciphertext []byte) {
	newAEAD := func(key []byte) (cipher.AEAD, error) {
		block, err := aes.NewCipher(key)
		if err != nil {
			return nil, err
		}
		return cipher.NewGCM(block)
	}

	// Decode the hex-encoded pubkey of the recipient.
	pubKeyBytes, err := hex.DecodeString(toPubKey) // uncompressed pubkey
	if err != nil {
		fmt.Println(err)
		return nil
	}

	pubKey, err := secp256k1.ParsePubKey(pubKeyBytes)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	// Derive an ephemeral public/private keypair for performing ECDHE with
	// the recipient.
	// Generate temporary public-private key pairs
	ephemeralPrivKey, err := secp256k1.GeneratePrivateKey()
	if err != nil {
		fmt.Println(err)
		return nil
	}
	ephemeralPubKey := ephemeralPrivKey.PubKey().SerializeCompressed()

	// Using ECDHE, derive a shared symmetric key for encryption of the plaintext.
	cipherKey := sha256.Sum256(secp256k1.GenerateSharedSecret(ephemeralPrivKey, pubKey))

	plaintext := []byte(data)

	aead, err := newAEAD(cipherKey[:])
	if err != nil {
		fmt.Println(err)
		return nil
	}

	nonce := make([]byte, aead.NonceSize())
	ciphertext = make([]byte, 4+len(ephemeralPubKey))

	binary.LittleEndian.PutUint32(ciphertext, uint32(len(ephemeralPubKey)))

	copy(ciphertext[4:], ephemeralPubKey)

	ciphertext = aead.Seal(ciphertext, nonce, plaintext, ephemeralPubKey)
	return
}

func decrypt(ciphertext []byte, privateKey string) (recoveredPlaintext []byte) {
	newAEAD := func(key []byte) (cipher.AEAD, error) {
		block, err := aes.NewCipher(key)
		if err != nil {
			return nil, err
		}
		return cipher.NewGCM(block)
	}

	pkBytes, err := hex.DecodeString(privateKey)
	if err != nil {
		fmt.Println(err)
		return
	}
	privKey := secp256k1.PrivKeyFromBytes(pkBytes)

	// Read the sender's ephemeral public key from the start of the message.
	// Error handling for inappropriate pubkey lengths is elided here for
	// brevity.
	pubKeyLen := binary.LittleEndian.Uint32(ciphertext[:4])

	senderPubKeyBytes := ciphertext[4 : 4+pubKeyLen]

	senderPubKey, err := secp256k1.ParsePubKey(senderPubKeyBytes)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Derive the key used to seal the message, this time from the
	// recipient's private key and the sender's public key.
	// Diffie-Hellman key exchange
	recoveredCipherKey := sha256.Sum256(secp256k1.GenerateSharedSecret(privKey, senderPubKey))

	aead, err := newAEAD(recoveredCipherKey[:])
	if err != nil {
		fmt.Println(err)
		return
	}
	nonce := make([]byte, aead.NonceSize())

	recoveredPlaintext, err = aead.Open(nil, nonce, ciphertext[4+pubKeyLen:], senderPubKeyBytes)
	if err != nil {
		fmt.Println(err)
		return
	}
	return
}

func main() {
	// Example
	// ed := encrypt("0401e62d2556b40106370dc6fd57b9029e74d388803f4ec94e4f7f02ee2c4900a6b8c63387c826c7d1c2d0cde9d36202702077ef18aed68260aa12d56789810015",
	// 	"privateKey")

	// decrypt(ed, "8430a6ba488499b76589f49369eef7e2712ba86f8804fa3a8a6f95b8fdf1dc93")
}
