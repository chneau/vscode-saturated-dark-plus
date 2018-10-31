package main

import (
	"io/ioutil"
	"os"
	"regexp"
	"strings"

	"github.com/chneau/tt"
	"github.com/lucasb-eyer/go-colorful"
)

func panicIf(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	defer tt.T()()
	f, err := os.OpenFile("./default-dark-theme-vscode.json", os.O_RDONLY, os.ModePerm)
	panicIf(err)
	b, err := ioutil.ReadAll(f)
	panicIf(err)
	panicIf(f.Close())
	r := regexp.MustCompile("#[0-9a-fA-F]{6}")
	alljson := string(b)
	colors := r.FindAllString(alljson, -1)
	for _, color := range colors {
		cf, err := colorful.Hex(color)
		panicIf(err)
		h, s, v := cf.Hsv()
		cf = colorful.Hsv(h, s*1.5, v).Clamped()
		newColor := cf.Hex()
		alljson = strings.Replace(alljson, color, newColor, -1)
	}
	err = ioutil.WriteFile("./saturated-dark.json", []byte(alljson), os.ModePerm)
	panicIf(err)
}
