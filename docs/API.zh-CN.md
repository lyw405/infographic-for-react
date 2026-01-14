# API 参考

## 组件

### `<Infographic />`

用于渲染信息图表的主组件。

#### 属性 (Props)

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|----------|---------|-------------|
| `dsl` | `string \| DSLString \| TemplateName` | 是* | - | 要渲染的 DSL 字符串或模板名称。如果未提供 `template` 则必需。 |
| `template` | `string` | 是* | - | 内置模板名称。如果未提供 `dsl` 则必需。 |
| `overrides` | `DSLOverride[]` | 否 | `[]` | 用于覆盖 DSL 值的路径-值对数组。 |
| `theme` | `ThemeConfig` | 否 | - | 主题配置。 |
| `palette` | `Palette` | 否 | - | 调色板配置。 |
| `width` | `number \| string` | 否 | `'100%'` | 容器宽度。 |
| `height` | `number \| string` | 否 | `'auto'` | 容器高度。 |
| `className` | `string` | 否 | - | 额外的 CSS 类名。 |
| `editable` | `boolean` | 否 | `false` | 启用交互式编辑。 |
| `beforeRender` | `PreRenderHook` | 否 | - | 渲染前调用的钩子，用于修改 DSL。 |
| `afterRender` | `PostRenderHook` | 否 | - | 渲染完成后调用的钩子。 |
| `onRender` | `(result: InfographicRenderResult) => void` | 否 | - | 渲染完成时的回调。 |
| `onError` | `(error: InfographicError) => void` | 否 | - | 发生错误时的回调。 |
| `onLoad` | `(result: InfographicRenderResult) => void` | 否 | - | 所有资源加载完成时的回调。 |

#### Ref

组件暴露的 ref 包含以下方法：

- `toDataURL(options?: ExportOptions): Promise<string>` - 将信息图表导出为数据 URL
- `getTypes(): string[] | undefined` - 获取信息图表中的元素类型
- `update(options: string | Partial<InfographicOptions>): void` - 使用新选项更新信息图表
- `destroy(): void` - 清理资源

#### 示例

```tsx
import { useRef } from 'react';
import { Infographic } from 'infographic-for-react';

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
      onRender={(result) => console.log('已渲染:', result)}
      onError={(error) => console.error('错误:', error)}
    />
  );
}
```

---

### `<ErrorBoundary />`

用于捕获 React 错误的错误边界组件。

#### 属性 (Props)

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | 是 | - | 要包裹的子组件。 |
| `fallback` | `ReactNode \| ((error: Error, errorInfo: ErrorInfo) => ReactNode)` | 否 | - | 自定义回退 UI。 |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | 否 | - | 捕获到错误时的回调。 |

#### 示例

```tsx
import { ErrorBoundary, Infographic } from 'infographic-for-react';

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

用于管理信息图表渲染的 Hook，提供对渲染器的完全控制。

#### 参数

- `containerRef: React.RefObject<HTMLElement>` - 容器元素的引用
- `props: InfographicProps` - 用于配置信息图表的属性

#### 返回值

包含以下方法的对象：

- `toDataURL(options?: ExportOptions): Promise<string>`
- `getTypes(): string[] | undefined`
- `update(options: string | Partial<InfographicOptions>): void`
- `destroy(): void`

#### 示例

```tsx
import { useRef, useCallback } from 'react';
import { useInfographic } from 'infographic-for-react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const infographic = useInfographic(containerRef, {
    dsl: '...',
    onRender: (result) => console.log('已渲染'),
  });

  const handleExport = useCallback(async () => {
    const dataURL = await infographic.toDataURL({ type: 'svg' });
    // ...
  }, [infographic]);

  return (
    <div>
      <button onClick={handleExport}>导出</button>
      <div ref={containerRef} style={{ width: 600, height: 400 }} />
    </div>
  );
}
```

---

### `useRenderer`

用于直接管理渲染器的底层 Hook。

#### 参数

- `containerRef: React.RefObject<HTMLElement>` - 容器元素的引用

#### 返回值

包含以下方法的对象：

- `render(options: string | Partial<InfographicOptions>): void`
- `update(options: string | Partial<InfographicOptions>): void`
- `toDataURL(options?: ExportOptions): Promise<string>`
- `getTypes(): string[] | undefined`
- `destroy(): void`
- `on(event: string, listener: Function): void`
- `off(event: string, listener: Function): void`
- `isReady: boolean`

---

## 工具函数

### `applyOverrides(dsl: string, overrides: DSLOverride[]): string`

将路径-值覆盖应用于 DSL 字符串。

#### 示例

```tsx
import { applyOverrides } from 'infographic-for-react';

const dsl = JSON.stringify({ design: { title: { text: '旧标题' } } });
const overrides = [
  { path: 'design.title.text', value: '新标题' }
];

const updated = applyOverrides(dsl, overrides);
// => { design: { title: { text: '新标题' } } }
```

---

### `mergeDSL(dsl1: string, dsl2: string): string`

深度合并两个 DSL 字符串。

#### 示例

```tsx
import { mergeDSL } from 'infographic-for-react';

const dsl1 = JSON.stringify({ a: 1, b: { x: 10 } });
const dsl2 = JSON.stringify({ b: { y: 20 }, c: 3 });

const merged = mergeDSL(dsl1, dsl2);
// => { a: 1, b: { x: 10, y: 20 }, c: 3 }
```

---

### `composeTemplates(options: ComposeTemplateOptions): string`

将多个模板组合成单个 DSL。

#### 参数

- `templates: string[]` - 要组合的 DSL 字符串数组
- `overrides?: DSLOverride[]` - 可选的覆盖选项

#### 示例

```tsx
import { composeTemplates } from 'infographic-for-react';

const headerDSL = JSON.stringify({ /* 头部配置 */ });
const bodyDSL = JSON.stringify({ /* 主体配置 */ });
const footerDSL = JSON.stringify({ /* 底部配置 */ });

const composed = composeTemplates({
  templates: [headerDSL, bodyDSL, footerDSL],
  overrides: [{ path: 'some.value', value: 123 }]
});
```

---

## 类型

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
