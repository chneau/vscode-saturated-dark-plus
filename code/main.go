package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
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

func downloadFileToByteArray(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return bytes, nil
}

func downloadDefaultDarkTheme() {
	darkPlusBytes, err := downloadFileToByteArray("https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_plus.json")
	lo.Must0(err)
	darkPlusTheme, err := UnmarshalTheme(darkPlusBytes)
	lo.Must0(err)

	darkBytes, err := downloadFileToByteArray("https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_vs.json")
	lo.Must0(err)
	darkTheme, err := UnmarshalTheme(darkBytes)
	lo.Must0(err)

	// Merge dark_plus into dark
	for key, val := range darkPlusTheme.Colors {
		darkTheme.Colors[key] = val
	}
	for key, val := range darkPlusTheme.SemanticTokenColors {
		darkTheme.SemanticTokenColors[key] = val
	}
	darkTheme.TokenColors = append(darkTheme.TokenColors, darkPlusTheme.TokenColors...)

	// Write to file in a pretty format
	alljson := lo.Must(json.MarshalIndent(darkTheme, "", "  "))
	lo.Must0(os.WriteFile("default-dark-theme-vscode.json", alljson, os.ModePerm))
}

func main() {
	defer func(start time.Time) { fmt.Println("Main executed in", time.Since(start)) }(time.Now())
	downloadDefaultDarkTheme()
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
	lo.Must0(os.WriteFile("../themes/Saturated Dark+-color-theme.json", alljson, os.ModePerm))
}
