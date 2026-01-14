# API Reference

## Components

### `<Infographic />`

Main component for rendering infographics.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dsl` | `string \| DSLString \| TemplateName` | Yes* | - | The DSL string or template name to render. Required if `template` is not provided. |
| `template` | `string` | Yes* | - | Built-in template name. Required if `dsl` is not provided. |
| `overrides` | `DSLOverride[]` | No | `[]` | Array of path-value pairs to override DSL values. |
| `theme` | `ThemeConfig` | No | - | Theme configuration. |
| `palette` | `Palette` | No | - | Color palette configuration. |
| `width` | `number \| string` | No | `'100%'` | Container width. |
| `height` | `number \| string` | No | `'auto'` | Container height. |
| `className` | `string` | No | - | Additional CSS class name. |
| `editable` | `boolean` | No | `false` | Enable interactive editing. |
| `beforeRender` | `PreRenderHook` | No | - | Hook called before rendering to modify DSL. |
| `afterRender` | `PostRenderHook` | No | - | Hook called after rendering completes. |
| `onRender` | `(result: InfographicRenderResult) => void` | No | - | Callback when rendering completes. |
| `onError` | `(error: InfographicError) => void` | No | - | Callback when an error occurs. |
| `onLoad` | `(result: InfographicRenderResult) => void` | No | - | Callback when all resources are loaded. |

#### Ref

The component exposes a ref with the following methods:

- `toDataURL(options?: ExportOptions): Promise<string>` - Export infographic as data URL
- `getTypes(): string[] | undefined` - Get element types in the infographic
- `update(options: string | Partial<InfographicOptions>): void` - Update infographic with new options
- `destroy(): void` - Cleanup resources

#### Example

```tsx
import { useRef } from 'react';
import { Infographic } from '@antv/infographic-react';

function App() {
  const ref = useRef(null);

  const dsl = JSON.stringify({
    design: { /* ... */ },
    data: { /* ... */ }
  });

  const handleExport = async () => {
    const dataURL = await ref.current?.toDataURL({ type: 'svg' });
    // ...
  };

  return (
    <Infographic
      ref={ref}
      dsl={dsl}
      width={800}
      height={600}
      onRender={(result) => console.log('Rendered:', result)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

---

### `<ErrorBoundary />`

Error boundary component for catching React errors.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Child components to wrap. |
| `fallback` | `ReactNode \| ((error: Error, errorInfo: ErrorInfo) => ReactNode)` | No | - | Custom fallback UI. |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | No | - | Callback when an error is caught. |

#### Example

```tsx
import { ErrorBoundary, Infographic } from '@antv/infographic-react';

function App() {
  return (
    <ErrorBoundary onError={(error) => console.error(error)}>
      <Infographic dsl={dsl} />
    </ErrorBoundary>
  );
}
```

---

## Hooks

### `useInfographic`

Hook for managing infographic rendering with full control over the renderer.

#### Parameters

- `containerRef: React.RefObject<HTMLElement>` - Reference to the container element
- `props: InfographicProps` - Props for configuring the infographic

#### Returns

An object with methods:

- `toDataURL(options?: ExportOptions): Promise<string>`
- `getTypes(): string[] | undefined`
- `update(options: string | Partial<InfographicOptions>): void`
- `destroy(): void`

#### Example

```tsx
import { useRef, useCallback } from 'react';
import { useInfographic } from '@antv/infographic-react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const infographic = useInfographic(containerRef, {
    dsl: '...',
    onRender: (result) => console.log('Rendered'),
  });

  const handleExport = useCallback(async () => {
    const dataURL = await infographic.toDataURL({ type: 'svg' });
    // ...
  }, [infographic]);

  return (
    <div>
      <button onClick={handleExport}>Export</button>
      <div ref={containerRef} style={{ width: 600, height: 400 }} />
    </div>
  );
}
```

---

### `useRenderer`

Lower-level hook for direct renderer management.

#### Parameters

- `containerRef: React.RefObject<HTMLElement>` - Reference to the container element

#### Returns

An object with methods:

- `render(options: string | Partial<InfographicOptions>): void`
- `update(options: string | Partial<InfographicOptions>): void`
- `toDataURL(options?: ExportOptions): Promise<string>`
- `getTypes(): string[] | undefined`
- `destroy(): void`
- `on(event: string, listener: Function): void`
- `off(event: string, listener: Function): void`
- `isReady: boolean`

---

## Utility Functions

### `applyOverrides(dsl: string, overrides: DSLOverride[]): string`

Apply path-value overrides to a DSL string.

#### Example

```tsx
import { applyOverrides } from '@antv/infographic-react';

const dsl = JSON.stringify({ design: { title: { text: 'Old' } } });
const overrides = [
  { path: 'design.title.text', value: 'New Title' }
];

const updated = applyOverrides(dsl, overrides);
// => { design: { title: { text: 'New Title' } } }
```

---

### `mergeDSL(dsl1: string, dsl2: string): string`

Deep merge two DSL strings.

#### Example

```tsx
import { mergeDSL } from '@antv/infographic-react';

const dsl1 = JSON.stringify({ a: 1, b: { x: 10 } });
const dsl2 = JSON.stringify({ b: { y: 20 }, c: 3 });

const merged = mergeDSL(dsl1, dsl2);
// => { a: 1, b: { x: 10, y: 20 }, c: 3 }
```

---

### `composeTemplates(options: ComposeTemplateOptions): string`

Compose multiple templates into a single DSL.

#### Parameters

- `templates: string[]` - Array of DSL strings to compose
- `overrides?: DSLOverride[]` - Optional overrides to apply

#### Example

```tsx
import { composeTemplates } from '@antv/infographic-react';

const headerDSL = JSON.stringify({ /* header config */ });
const bodyDSL = JSON.stringify({ /* body config */ });
const footerDSL = JSON.stringify({ /* footer config */ });

const composed = composeTemplates({
  templates: [headerDSL, bodyDSL, footerDSL],
  overrides: [{ path: 'some.value', value: 123 }]
});
```

---

## Types

### `DSLOverride`

```ts
interface DSLOverride {
  path: string;
  value: unknown;
}
```

### `InfographicError`

```ts
interface InfographicError {
  type: 'syntax' | 'render' | 'runtime';
  message: string;
  dsl?: string;
  details?: string | Error | unknown;
}
```

### `InfographicRenderResult`

```ts
interface InfographicRenderResult {
  node: SVGSVGElement;
  options: InfographicOptions;
}
```

### `PreRenderHook`

```ts
type PreRenderHook = (dsl: string) => string | Promise<string>;
```

### `PostRenderHook`

```ts
type PostRenderHook = (result: InfographicRenderResult) => void | Promise<void>;
```
