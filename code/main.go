package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"strings"

	"github.com/chneau/tt"
	"github.com/lucasb-eyer/go-colorful"
)

func panicIf(err error) {
	if err != nil {
		panic(err)
	}
}

func saturate(val string) (string, error) {
	if len(val) > 6 {
		cf, err := colorful.Hex(val[:7])
		panicIf(err)
		h, s, v := cf.Hsv()
		cf = colorful.Hsv(h, s*1.5, v).Clamped()
		newColor := cf.Hex()
		return strings.ReplaceAll(val, val[:7], newColor), nil
	}
	return "", errors.New("size")
}

func main() {
	defer tt.T()()
	file, err := ioutil.ReadFile("default-dark-theme-vscode.json")
	panicIf(err)
	theme := Theme{}
	theme.Name = "Saturated Dark+"
	panicIf(json.Unmarshal(file, &theme))
	for key, val := range theme.Colors {
		res, err := saturate(val)
		panicIf(err)
		theme.Colors[key] = res
	}
	for i, val := range theme.TokenColors {
		if val.Settings.Foreground != nil {
			res, err := saturate(*val.Settings.Foreground)
			panicIf(err)
			theme.TokenColors[i].Settings.Foreground = &res
		}
	}
	alljson, err := json.Marshal(theme)
	panicIf(err)
	err = ioutil.WriteFile("../themes/Saturated Dark+-color-theme.json", []byte(alljson), os.ModePerm)
	panicIf(err)
}

// Theme ...
type Theme struct {
	Name        string            `json:"name"`
	Schema      string            `json:"$schema"`
	Type        string            `json:"type"`
	Colors      map[string]string `json:"colors"`
	TokenColors []TokenColor      `json:"tokenColors"`
}

// TokenColor ...
type TokenColor struct {
	Scope    interface{} `json:"scope"`
	Settings Settings    `json:"settings"`
	Name     *string     `json:"name,omitempty"`
}

// Settings ...
type Settings struct {
	Foreground *string `json:"foreground,omitempty"`
	FontStyle  *string `json:"fontStyle,omitempty"`
}
