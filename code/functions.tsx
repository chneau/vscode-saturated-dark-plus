import Color from "color";
import { parse } from "json5";
import type { Theme } from "./models";

export const downloadTheme = async (themeName: string) => {
	const url = `https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/${themeName}.json`;
	const response = await fetch(url);
	const text = await response.text();
	const theme = parse<Theme>(text);
	theme.tokenColors ??= [];
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
		fusedTheme.semanticTokenColors = {
			...fusedTheme.semanticTokenColors,
			...theme.semanticTokenColors,
		};
		fusedTheme.colors = { ...fusedTheme.colors, ...theme.colors };
	}
	return fusedTheme;
};
const colorToHsva = (color: Color<string>) => {
	const [h, s, v, a] = color.hsv().array();
	if (h === undefined || s === undefined || v === undefined) {
		throw new Error(`Invalid color: ${color}`);
	}
	return [h, s, v, a ?? 1] as const;
};
export const saturateTheme = (theme: Theme) => {
	const saturatedTheme: Theme = { ...theme, name: "Saturated Dark+" };
	for (const key in saturatedTheme.colors) {
		const color = Color(saturatedTheme.colors[key]);
		const [h, s, v, a] = colorToHsva(color);
		saturatedTheme.colors[key] = color.hsv(h, s * 1.5, v, a).hexa();
	}
	for (const key in saturatedTheme.semanticTokenColors) {
		const color = Color(saturatedTheme.semanticTokenColors[key]);
		const [h, s, v, a] = colorToHsva(color);
		saturatedTheme.semanticTokenColors[key] = color
			.hsv(h, s * 1.5, v, a)
			.hexa();
	}
	for (const value of Object.values(saturatedTheme.tokenColors)) {
		const hex = value.settings.foreground;
		if (!hex) continue;
		const color = Color(hex);
		const [h, s, v, a] = colorToHsva(color);
		value.settings.foreground = color.hsv(h, s * 2.3, v, a).hexa();
	}
	return saturatedTheme;
};
