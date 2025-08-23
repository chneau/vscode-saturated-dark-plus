import { downloadTheme, fuseThemes, saturateTheme } from "./functions";
import type { Theme } from "./models";

// variables
const themesToDownload = ["dark_vs", "dark_plus"];
const tempFile = "default-dark-theme-vscode.json";
const finalFile = "../themes/Saturated Dark+-color-theme.json";

const start = new Date();
const msSinceStartInMs = () =>
	(Date.now() - start.getTime()).toString().padStart(3, " ");
console.log(`${msSinceStartInMs()}ms: Starting...`);

// download the themes
const darkThemes = await Promise.all(themesToDownload.map(downloadTheme));
console.log(`${msSinceStartInMs()}ms: Downloaded themes...`);

// fuse everything together
const theme: Theme = fuseThemes(...darkThemes);
console.log(`${msSinceStartInMs()}ms: Fused themes...`);

// write the theme to disk
await Bun.write(tempFile, JSON.stringify(theme));
await Bun.$`biome format --write ${tempFile}`.quiet().nothrow();
console.log(`${msSinceStartInMs()}ms: Wrote theme...`);

// create a copy with saturated colors
const saturatedTheme = saturateTheme(theme);
console.log(`${msSinceStartInMs()}ms: Saturated colors...`);

// prettify the theme
const prettyFormat = JSON.stringify(saturatedTheme);
console.log(`${msSinceStartInMs()}ms: Formatted theme...`);

// write the theme to disk
await Bun.write(finalFile, prettyFormat);
console.log(`${msSinceStartInMs()}ms: Wrote saturated theme...`);
