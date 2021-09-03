package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
	"time"

	"github.com/lucasb-eyer/go-colorful"
)

func panicIf(err error) {
	if err != nil {
		panic(err)
	}
}

func saturate(val string, saturation float64) (string, error) {
	if len(val) > 6 {
		cf, err := colorful.Hex(val[:7])
		panicIf(err)
		h, s, v := cf.Hsv()
		cf = colorful.Hsv(h, s*saturation, v).Clamped()
		colorful.FastHappyColor()
		newColor := cf.Hex()
		return strings.ReplaceAll(val, val[:7], newColor), nil
	}
	return "", errors.New(fmt.Sprint("Invalid color: ", val))
}

func main() {
	defer func(start time.Time) { fmt.Println("Main executed in", time.Since(start)) }(time.Now())
	file, err := ioutil.ReadFile("default-dark-theme-vscode.json")
	panicIf(err)
	theme := Theme{}
	theme.Name = "Saturated Dark+"
	panicIf(json.Unmarshal(file, &theme))
	for key, val := range theme.Colors {
		res, err := saturate(val, 1.5)
		panicIf(err)
		theme.Colors[key] = res
	}
	for i, val := range theme.TokenColors {
		if val.Settings.Foreground != nil {
			res, err := saturate(*val.Settings.Foreground, 2.3)
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
