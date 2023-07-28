import Color from "color";
import { parse } from "json5";
import { Theme } from "./models";

export const downloadTheme = async (themeName: string) => {
  const url = `https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/${themeName}.json`;
  const response = await fetch(url);
  const text = await response.text();
  const theme = parse<Theme>(text);
  return theme;
};
export const fuseThemes = (...themes: Theme[]) => {
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
export const saturateTheme = (theme: Theme) => {
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
  return saturatedTheme;
};
