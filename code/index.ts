import { format } from "prettier";
import { downloadTheme, fuseThemes, saturateTheme } from "./functions";
import { Theme } from "./models";

const start = new Date();
const msSinceStartInMs = () => (new Date().getTime() - start.getTime()).toString().padStart(3, " ");
console.log(`${msSinceStartInMs()}ms: Starting...`);

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
const saturatedTheme = saturateTheme(theme);
console.log(`${msSinceStartInMs()}ms: Saturated colors...`);

// prettify the theme
const prettyFormat = await format(JSON.stringify(saturatedTheme), { parser: "json" });
console.log(`${msSinceStartInMs()}ms: Formatted theme...`);

// write the theme to disk
await Bun.write("../themes/Saturated Dark+-color-theme.json", prettyFormat);
console.log(`${msSinceStartInMs()}ms: Wrote saturated theme...`);
