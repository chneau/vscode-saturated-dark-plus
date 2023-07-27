export interface Theme {
  schema: string;
  name: string;
  include?: string;
  tokenColors: TokenColor[];
  semanticTokenColors: Record<string, string>;
  colors?: Record<string, string>;
  semanticHighlighting?: boolean;
}

export interface TokenColor {
  name?: string;
  scope: string[] | string;
  settings: Settings;
}

export interface Settings {
  foreground?: string;
  fontStyle?: string;
}
