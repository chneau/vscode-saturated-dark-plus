import Color from "color";
import { parse } from "json5";
import { format } from "prettier";
import { Theme } from "./models";

const start = new Date();
const msSinceStartInMs = () => new Date().getTime() - start.getTime();
console.log(`${msSinceStartInMs()}ms: Starting...`);
const downloadTheme = async (themeName: string) => {
  const url = `https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/${themeName}.json`;
  const response = await fetch(url);
  const text = await response.text();
  const theme = parse<Theme>(text);
  return theme;
};
const fuseThemes = (...themes: Theme[]) => {
  const fusedTheme: Theme = {
    $schema: "vscode://schemas/color-theme",
    name: "Saturated Dark+",
    colors: {},
    tokenColors: [],
    semanticHighlighting: true,
    semanticTokenColors: {},
  };
  for (const theme of themes) {
    fusedTheme.tokenColors.push(...theme.tokenColors);
    fusedTheme.semanticTokenColors = { ...fusedTheme.semanticTokenColors, ...theme.semanticTokenColors };
    fusedTheme.colors = { ...fusedTheme.colors, ...theme.colors };
  }
  return fusedTheme;
};

// download the themes
const [dark, darkPlus] = await Promise.all([downloadTheme("dark_vs"), downloadTheme("dark_plus")]);
console.log(`${msSinceStartInMs()}ms: Downloaded themes...`);

// fuse everything together
const theme: Theme = fuseThemes(dark, darkPlus);
console.log(`${msSinceStartInMs()}ms: Fused themes...`);

// write the theme to disk
await Bun.write("default-dark-theme-vscode.json", await format(JSON.stringify(theme), { parser: "json" }));
console.log(`${msSinceStartInMs()}ms: Wrote theme...`);

// create a copy with saturated colors
const saturatedTheme: Theme = { ...theme, name: "Saturated Dark+" };
for (const key in saturatedTheme.colors) {
  const color = Color(saturatedTheme.colors[key]);
  const [h, s, v, a] = color.hsv().array();
  saturatedTheme.colors[key] = color.hsv(h, s * 1.5, v, a).hexa();
}
for (const key in saturatedTheme.semanticTokenColors) {
  const color = Color(saturatedTheme.semanticTokenColors[key]);
  const [h, s, v, a] = color.hsv().array();
  saturatedTheme.semanticTokenColors[key] = color.hsv(h, s * 1.5, v, a).hexa();
}
for (const key in saturatedTheme.tokenColors) {
  const hex = saturatedTheme.tokenColors[key].settings.foreground;
  if (!hex) continue;
  const color = Color(hex);
  const [h, s, v, a] = color.hsv().array();
  saturatedTheme.tokenColors[key].settings.foreground = color.hsv(h, s * 2.3, v, a).hexa();
}
console.log(`${msSinceStartInMs()}ms: Saturated colors...`);

// prettify the theme
const prettyFormat = await format(JSON.stringify(saturatedTheme), { parser: "json" });
console.log(`${msSinceStartInMs()}ms: Formatted theme...`);

// write the theme to disk
await Bun.write("../themes/Saturated Dark+-color-theme.json", prettyFormat);
console.log(`${msSinceStartInMs()}ms: Wrote saturated theme...`);
