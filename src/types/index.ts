export interface ThemeConfig {
  name?: string;
  colors?: Record<string, string>;
}

export interface Palette {
  name?: string;
  colors: string[];
}

export interface SyntaxError {
  message: string;
  line?: number;
  column?: number;
}

export interface InfographicOptions {
  container?: HTMLElement;
  width?: number | string;
  height?: number | string;
  theme?: ThemeConfig;
  palette?: Palette;
  editable?: boolean;
  design?: unknown;
  data?: unknown;
}

export type ExportOptions = {
  type?: 'svg' | 'png';
  quality?: number;
  scale?: number;
};

export interface DSLString {
  type: 'dsl';
  value: string;
}

export interface TemplateName {
  type: 'template';
  value: string;
}

export type DSLInput = string | DSLString | TemplateName;

export interface DSLOverride {
  path: string;
  value: unknown;
}

export interface InfographicRenderResult {
  node: SVGSVGElement;
  options: InfographicOptions;
}

export interface InfographicError {
  type: 'syntax' | 'render' | 'runtime';
  message: string;
  dsl?: string;
  details?: string | Error | unknown;
}

export type PreRenderHook = (dsl: string) => string | Promise<string>;

export type PostRenderHook = (result: InfographicRenderResult) => void | Promise<void>;

export interface InfographicProps {
  dsl?: DSLInput;
  template?: string;
  overrides?: DSLOverride[];
  theme?: ThemeConfig;
  palette?: Palette;
  width?: number | string;
  height?: number | string;
  className?: string;
  editable?: boolean;
  beforeRender?: PreRenderHook;
  afterRender?: PostRenderHook;
  onRender?: (result: InfographicRenderResult) => void;
  onError?: (error: InfographicError) => void;
  onLoad?: (result: InfographicRenderResult) => void;
}

export interface InfographicRef {
  toDataURL: (options?: ExportOptions) => Promise<string>;
  getTypes: () => string[] | undefined;
  update: (options: string | Partial<InfographicOptions>) => void;
  destroy: () => void;
}

export interface RendererInstance {
  render: () => boolean;
  update: (options: string | Partial<InfographicOptions>) => void;
  toDataURL: (options?: ExportOptions) => Promise<string>;
  getTypes: () => string[] | undefined;
  destroy: () => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
}

export interface ComposeTemplateOptions {
  templates: string[];
  overrides?: DSLOverride[];
}
