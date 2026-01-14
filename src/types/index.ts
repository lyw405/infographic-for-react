import type {
  ThemeConfig,
  Palette,
  InfographicOptions,
  ExportOptions,
  SyntaxError,
} from '@antv/infographic';

export type { ThemeConfig, Palette, InfographicOptions, ExportOptions, SyntaxError };

export interface DSLItem {
  label: string;
  desc?: string;
  icon?: string;
  illus?: string;
  value?: number;
  children?: DSLItem[];
}

export interface DSLData {
  title: string;
  desc?: string;
  items: DSLItem[];
}

export interface DSLTheme {
  name: string;
  palette: string;
}

export interface DSLObject extends Partial<InfographicOptions> {
  data: DSLData;
}

export type DSLInput = string | DSLObject;

export interface DSLOverride {
  path: string;
  value: unknown;
}

export interface InfographicRenderResult {
  node: SVGSVGElement;
  options: Partial<InfographicOptions>;
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
  getTypes: () => string | undefined;
  update: (options: DSLInput) => Promise<void>;
  destroy: () => void;
}

export interface RendererInstance {
  render: (options?: string | Partial<InfographicOptions>) => void;
  update: (options: string | Partial<InfographicOptions>) => void;
  toDataURL: (options?: ExportOptions) => Promise<string>;
  getTypes: () => string | undefined;
  destroy: () => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
}

export interface ComposeTemplateOptions {
  templates: string[];
  overrides?: DSLOverride[];
}
