package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/lucasb-eyer/go-colorful"
	"github.com/samber/lo"
)

func saturate(val string, saturation float64) (string, error) {
	if len(val) > 6 {
		cf := lo.Must(colorful.Hex(val[:7]))
		h, s, v := cf.Hsv()
		cf = colorful.Hsv(h, s*saturation, v).Clamped()
		newColor := cf.Hex()
		return strings.ReplaceAll(val, val[:7], newColor), nil
	}
	return "", errors.New(fmt.Sprint("Invalid color: ", val))
}

func main() {
	defer func(start time.Time) { fmt.Println("Main executed in", time.Since(start)) }(time.Now())
	file := lo.Must(os.ReadFile("default-dark-theme-vscode.json"))
	theme := Theme{}
	theme.Name = "Saturated Dark+"
	lo.Must0(json.Unmarshal(file, &theme))
	for key, val := range theme.Colors {
		res := lo.Must(saturate(val, 1.5))
		theme.Colors[key] = res
	}
	for i, val := range theme.TokenColors {
		if val.Settings.Foreground != nil {
			res := lo.Must(saturate(*val.Settings.Foreground, 2.3))
			theme.TokenColors[i].Settings.Foreground = &res
		}
	}
	alljson := lo.Must(json.Marshal(theme))
	lo.Must0(os.WriteFile("../themes/Saturated Dark+-color-theme.json", []byte(alljson), os.ModePerm))
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
