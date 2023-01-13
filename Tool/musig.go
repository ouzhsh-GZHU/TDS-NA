package Tool

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/big"

	"github.com/btcsuite/btcd/btcec"
	"github.com/tnakagawa/musig"
)

// Cite https://github.com/tnakagawa/musig

// KeyGen returns a private/public key pair.
func KeyGen() (*btcec.PrivateKey, *btcec.PublicKey) {
	x, _ := rand.Int(rand.Reader, btcec.S256().N)
	return btcec.PrivKeyFromBytes(btcec.S256(), x.Bytes())
}

// Sign returns a signature.
// L = {X1, ... , Xn} is the multiset of all public keys.
// R is sum all random points. R = R1 + ... + Rn
// m is message.
// x is private key. Xi = xG, X is public key.
// r is random value. Ri = rG.
func Sign(L []*btcec.PublicKey, R *btcec.PublicKey, m []byte, x, r *btcec.PrivateKey) *big.Int {
	var a *big.Int
	Xt := new(btcec.PublicKey)
	// X~ = a_0*X_0 + ... + a_n*X_n
	for i, Xi := range L {
		// a_i = H_agg(L,X_i)
		ai := Hagg(L, Xi)
		if i == 0 {
			Xt.X, Xt.Y = btcec.S256().ScalarMult(Xi.X, Xi.Y, ai.Bytes())
		} else {
			Xix, Xiy := btcec.S256().ScalarMult(Xi.X, Xi.Y, ai.Bytes())
			Xt.X, Xt.Y = btcec.S256().Add(Xt.X, Xt.Y, Xix, Xiy)
		}
		if a == nil && Xi.IsEqual(x.PubKey()) {
			a = ai
		}
	}
	// c = H_sig(H~,R,m)
	c := Hsig(Xt, R, m)
	// 	s_i = r_i + c*a_i*x_i mod p
	s := new(big.Int).Mod(new(big.Int).Add(r.D, new(big.Int).Mul(new(big.Int).Mul(c, a), x.D)), btcec.S256().N)
	return s
}

// Ver returns 1 if the signature is valid and 0 otherwise.
// L = {X1, ... , Xn} is the multiset of all public keys.
// m is message.
// σ = (R,s)
// R is sum all random points. R = R1 + ... + Rn
// s is signature.
func Ver(L []*btcec.PublicKey, m []byte, R *btcec.PublicKey, s *big.Int) int {
	Xt := new(btcec.PublicKey)
	// X~ = a_0*X_0 + ... + a_n*X_n
	for i, Xi := range L {
		// a_i = H_agg(L,X_i)
		ai := Hagg(L, Xi)
		if i == 0 {
			Xt.X, Xt.Y = btcec.S256().ScalarMult(Xi.X, Xi.Y, ai.Bytes())
		} else {
			Xix, Xiy := btcec.S256().ScalarMult(Xi.X, Xi.Y, ai.Bytes())
			Xt.X, Xt.Y = btcec.S256().Add(Xt.X, Xt.Y, Xix, Xiy)
		}
	}
	// c = H_sig(H~,R,m)
	c := Hsig(Xt, R, m)
	cXt := new(btcec.PublicKey)
	// cX~ = c * X~
	cXt.X, cXt.Y = btcec.S256().ScalarMult(Xt.X, Xt.Y, c.Bytes())
	RXc := new(btcec.PublicKey)
	// R + cX~
	RXc.X, RXc.Y = btcec.S256().Add(R.X, R.Y, cXt.X, cXt.Y)
	// sG = s*G
	sG := new(btcec.PublicKey)
	sG.X, sG.Y = btcec.S256().ScalarBaseMult(s.Bytes())
	// sG = R + cX~
	if sG.IsEqual(RXc) {
		return 1
	}
	return 0
}

// Hagg returns hash value.
func Hagg(L []*btcec.PublicKey, R *btcec.PublicKey) *big.Int {
	s := sha256.New()
	for _, Xi := range L {
		s.Write(Xi.SerializeCompressed())
	}
	s.Write(R.SerializeCompressed())
	hash := s.Sum(nil)
	h := big.NewInt(0)
	h.SetBytes(hash)
	return h
}

// Hsig returns hash value.
func Hsig(X, R *btcec.PublicKey, m []byte) *big.Int {
	s := sha256.New()
	s.Write(X.SerializeCompressed())
	s.Write(R.SerializeCompressed())
	s.Write(m)
	hash := s.Sum(nil)
	h := big.NewInt(0)
	h.SetBytes(hash)
	return h
}

// Hcom returns hash value.
func Hcom(R *btcec.PublicKey) []byte {
	s := sha256.New()
	s.Write(R.SerializeCompressed())
	hash := s.Sum(nil)
	return hash
}

// AddPubs returns sum public key.
func AddPubs(pubs ...*btcec.PublicKey) *btcec.PublicKey {
	P := new(btcec.PublicKey)
	for i, pub := range pubs {
		if i == 0 {
			P.X, P.Y = pub.X, pub.Y
		} else {
			P.X, P.Y = btcec.S256().Add(P.X, P.Y, pub.X, pub.Y)
		}
	}
	return P
}

// AddSigs returns sum signature.
func AddSigs(sigs ...*big.Int) *big.Int {
	S := big.NewInt(0)
	for _, sig := range sigs {
		S = new(big.Int).Add(S, sig)
	}
	return S
}

// string private key to public key
func genPrivatePublicKey(privateKey_Str string) (*btcec.PrivateKey, *btcec.PublicKey) {
	pkBytes, err := hex.DecodeString(privateKey_Str)
	if err != nil {
		fmt.Println(err)
		return nil, nil
	}
	// private/public keys
	x, X := btcec.PrivKeyFromBytes(btcec.S256(), pkBytes)
	return x, X
}

// Verify multiple signatures
func verMulSign(L []*btcec.PublicKey, mStr string, RStr string, sStr string) bool {
	pubKeyBytes, err := hex.DecodeString(RStr)
	if err != nil {
		fmt.Println(err)
		return false
	}
	R, err := btcec.ParsePubKey(pubKeyBytes, btcec.S256())
	if err != nil {
		fmt.Println(err)
		return false
	}
	s, _ := new(big.Int).SetString(sStr, 10)

	v := musig.Ver(L, []byte(mStr), R, s)
	if v != 1 {
		fmt.Printf("Fail\n")
		return false
	} else {
		fmt.Printf("verMulSign success!\n")
		return true
	}
}

func main() {
	// Example 5-NA
	// // NA1
	// // private/public keys
	// x1, X1 := genPrivatePublicKey("f2fa39e48f7e43c511393b5cb1f94e5ecd5a4733a5dbdbcd9468c9964cb598b0")
	// // random private/public keys value
	// r1, R1 := musig.KeyGen()
	// fmt.Printf("x1:%x,X1:%x\n", x1.Serialize(), X1.SerializeCompressed())
	// fmt.Printf("r1:%x,R1:%x\n", r1.Serialize(), R1.SerializeCompressed())

	// // NA2
	// // private/public keys
	// x2, X2 := genPrivatePublicKey("f4cae57530edd827c6dbe431cbbeb3f956772ee14aafc5152f0658f85326f4f1")
	// // // random private/public keys value
	// r2, R2 := musig.KeyGen()
	// fmt.Printf("x2:%x,X2:%x\n", x2.Serialize(), X2.SerializeCompressed())
	// fmt.Printf("r2:%x,R2:%x\n", r2.Serialize(), R2.SerializeCompressed())

	// // NA3
	// // private/public keys
	// x3, X3 := genPrivatePublicKey("9995bf82132cd811db214ae0b039de28dcbc12d526a99dc3bb0f983d90be0eee")
	// // // random private/public keys value
	// r3, R3 := musig.KeyGen()
	// fmt.Printf("x3:%x,X3:%x\n", x3.Serialize(), X3.SerializeCompressed())
	// fmt.Printf("r3:%x,R3:%x\n", r3.Serialize(), R3.SerializeCompressed())

	// // NA4
	// // private/public keys
	// x4, X4 := genPrivatePublicKey("ff53b0c25db95fb0490866a9af861f629adf692a0989ca3f522dee4718581c56")
	// // // random private/public keys value
	// r4, R4 := musig.KeyGen()
	// fmt.Printf("x4:%x,X4:%x\n", x4.Serialize(), X4.SerializeCompressed())
	// fmt.Printf("r4:%x,R4:%x\n", r4.Serialize(), R4.SerializeCompressed())

	// // NA5
	// // private/public keys
	// x5, X5 := genPrivatePublicKey("285de8d8e9b4dbc03715954a5fd38686ef920b6807f1aa993b2adaaa88215795")
	// // // random private/public keys value
	// r5, R5 := musig.KeyGen()
	// fmt.Printf("x5:%x,X5:%x\n", x5.Serialize(), X5.SerializeCompressed())
	// fmt.Printf("r5:%x,R5:%x\n", r5.Serialize(), R5.SerializeCompressed())

	// // L is a multiset of public keys.
	// var L []*btcec.PublicKey
	// L = append(L, X1)
	// L = append(L, X2)
	// L = append(L, X3)
	// L = append(L, X4)
	// L = append(L, X5)

	// // R is a part of signature.
	// R := musig.AddPubs(R1, R2, R3, R4, R5)
	// fmt.Printf("R:%x\n", R.SerializeCompressed())

	// // message
	// m := []byte("0xdc7afaac4fae88aeb95cc4a51dfc40ca3e4898e8cadc22bb80990ac2eb8add2f")

	// //Signing
	// // NAs signs.
	// s1 := musig.Sign(L, R, m, x1, r1)

	// s2 := musig.Sign(L, R, m, x2, r2)

	// s3 := musig.Sign(L, R, m, x3, r3)

	// s4 := musig.Sign(L, R, m, x4, r4)

	// s5 := musig.Sign(L, R, m, x5, r5)

	// fmt.Println("s1, s2, s3, s4, s5", s1.String(), s2.String(), s3.String(), s4.String(), s5.String())

	// // DSU Aggregate Signature
	// // s is a part of signature.
	// s := musig.AddSigs(s1, s2, s3, s4, s5)
	// // signature
	// fmt.Printf("Signature\n")
	// fmt.Printf("R:%x\n", R.SerializeCompressed())
	// fmt.Printf("s:%v\n", s)

	// // Verification
	// v := verMulSign(L, "0xe46b9c392ed32969dcd5eeb4e10ec2454d32fad7f8dd142f909f751c42f6856c",
	// 	"02534b24606fbf3b16194108621016a5be71cd75da87eab80302ef342b823b9729",
	// 	"264498015111488072137471705086696963240510555793717475249553151224670058925649")
	// fmt.Printf("Result:%v\n", v)
}
