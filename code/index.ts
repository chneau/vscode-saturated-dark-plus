import { parse } from "json5";
import { format } from "prettier";
import { Theme } from "./models";

const downloadTheme = async (themeName: string) => {
  const url = `https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/${themeName}.json`;
  const response = await fetch(url);
  const text = await response.text();
  const theme = parse<Theme>(text);
  return theme;
};

const [dark, darkPlus] = await Promise.all([downloadTheme("dark_vs"), downloadTheme("dark_plus")]);

// fuse everything together
const theme: Theme = {
  ...dark,
  ...darkPlus,
  tokenColors: [...dark.tokenColors, ...darkPlus.tokenColors],
  semanticTokenColors: { ...dark.semanticTokenColors, ...darkPlus.semanticTokenColors },
  colors: { ...dark.colors, ...darkPlus.colors },
  include: undefined,
};

// save theme as default-dark-theme-vscode.json
await Bun.write("default-dark-theme-vscode.json", await format(JSON.stringify(theme), { parser: "json" }));
