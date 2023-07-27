import Color from "color";
import { parse } from "json5";
import { format } from "prettier";
import { Theme } from "./models";

const start = new Date();
const msSinceStartInMs = () => new Date().getTime() - start.getTime();
const downloadTheme = async (themeName: string) => {
  const url = `https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/${themeName}.json`;
  const response = await fetch(url);
  const text = await response.text();
  const theme = parse<Theme>(text);
  return theme;
};

console.log(`${msSinceStartInMs()}ms: Starting...`);
const [dark, darkPlus] = await Promise.all([downloadTheme("dark_vs"), downloadTheme("dark_plus")]);
console.log(`${msSinceStartInMs()}ms: Downloaded themes...`);

// fuse everything together
const theme: Theme = {
  ...dark,
  ...darkPlus,
  tokenColors: [...dark.tokenColors, ...darkPlus.tokenColors],
  semanticTokenColors: { ...dark.semanticTokenColors, ...darkPlus.semanticTokenColors },
  colors: { ...dark.colors, ...darkPlus.colors },
  include: undefined,
};
console.log(`${msSinceStartInMs()}ms: Fused themes...`);

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

const prettyFormat = await format(JSON.stringify(saturatedTheme), { parser: "json" });

console.log(`${msSinceStartInMs()}ms: Formatted theme...`);

await Bun.write("../themes/Saturated Dark+-color-theme.json", prettyFormat);

console.log(`${msSinceStartInMs()}ms: Wrote saturated theme...`);
