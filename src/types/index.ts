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
  time?: string;
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
  palette?: Palette;
  themeConfig?: ThemeConfig;
}

export type DSLInput = DSLObject;

export interface DSLOverride {
  path: string;
  value: unknown;
}

export type PreRenderHook = (dsl: DSLObject) => DSLObject | Promise<DSLObject>;

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

export type PostRenderHook = (result: InfographicRenderResult) => void | Promise<void>;

export interface ComposeTemplateOptions {
  templates: DSLObject[];
  overrides?: DSLOverride[];
}

export interface InfographicProps {
  dsl?: DSLInput;
  overrides?: DSLOverride[];
  theme?: string;
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
  render: (options?: Partial<InfographicOptions>) => void;
  update: (options: Partial<InfographicOptions>) => void;
  toDataURL: (options?: ExportOptions) => Promise<string>;
  getTypes: () => string | undefined;
  destroy: () => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
}
