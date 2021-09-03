# Saturated Dark+

## What does it looks like?

It's the basic Dark+ with more saturation.

## How do I build this theme?

- Run `code --disable-extensions`
- `Ctrl+shift+p` and type `Generate Color`
- Copy paste to file `default-dark-theme-vscode.json`
- Close the extensionless vscode
- Uncomment commented lines and remove null values
- Run the go code
- Test by pressing `F5`
- `npm install -g vsce`
- update `package.json` version
- get token here https://dev.azure.com/chneau/_usersSettings/tokens
- Organization: `All accessible organizations`
- `vsce publish`
- Paste token
- Revoke token

## Programmaticaly, what does it do?

It reads the default theme as a json file configuration, and it adds saturation on each hex color found using the Hsv color (source wikipedia: "HSV (hue, saturation, value, also known as HSB or hue, saturation, brightness)").

```go
h, s, v := cf.Hsv()
cf = colorful.Hsv(h, s*value, v).Clamped() // value is 1.5 for theme.Colors and 2.3 for theme.TokenColors foregrounds
```
