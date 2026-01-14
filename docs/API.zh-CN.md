# API 参考

[English documentation](./API.md)

## 组件

### `<Infographic />`

用于渲染信息图表的主组件。

#### Props

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `children` | `string` | 条件性* | - | **（推荐）**作为组件 children 的 DSL，使用模板字符串包裹。当提供时优先级高于 `dsl` prop。必须是有效的信息图表 DSL 字符串。 |
| `dsl` | `string \\\| DSLObject` | 条件性* | - | 要渲染的 DSL。可以是字符串（原生信息图表语法）或对象（支持 `template`、`theme`、`palette`、`themeConfig` 字段）。当提供 `children` 时被忽略。 |
| `overrides` | `DSLOverride[]` | 否 | `[]` | 路径-值对数组，用于覆盖 DSL 值。**仅当 `dsl` 为对象时生效**。 |
| `theme` | `string` | 否 | - | 主题名称。未提供时回退到 `dsl.theme`。 |
| `palette` | `Palette` | 否 | - | 颜色调色板。未提供时回退到 `dsl.palette`（合并到 `themeConfig.palette`）。 |
| `width` | `number \\\| string` | 否 | `'100%'` | 容器宽度。 |
| `height` | `number \\\| string` | 否 | `'auto'` | 容器高度。 |
| `className` | `string` | 否 | - | 额外的 CSS 类名。 |
| `editable` | `boolean` | 否 | `false` | 启用交互式编辑。 |
| `beforeRender` | `PreRenderHook` | 否 | - | 渲染前调用的钩子，用于修改 DSL。**仅当 `dsl` 为对象时生效**。 |
| `afterRender` | `PostRenderHook` | 否 | - | 渲染完成后调用的钩子。 |
| `onRender` | `(result: InfographicRenderResult) => void` | 否 | - | 渲染完成时的回调。 |
| `onError` | `(error: InfographicError) => void` | 否 | - | 发生错误时的回调。 |
| `onLoad` | `(result: InfographicRenderResult) => void` | 否 | - | 所有资源加载完成时的回调。 |

> *必须提供 `children` 或 `dsl` prop 中的至少一个。当两者同时提供时，`children` 优先级更高。使用模板字符串包裹的 `children` 是大多数场景的推荐方式。

#### Ref

组件暴露了一个包含以下方法的 ref：

- `toDataURL(options?: ExportOptions): Promise<string>` - 将信息图表导出为数据 URL
- `getTypes(): string[] | undefined` - 获取信息图表中的元素类型
- `update(options: DSLInput): Promise<void>` - 使用新 DSL 更新信息图表
- `destroy(): void` - 清理资源

#### 示例

```tsx
import { useRef } from 'react';
import { Infographic } from 'infographic-for-react';

function App() {
  const ref = useRef(null);

  const handleExport = async () => {
    const dataURL = await ref.current?.toDataURL({ type: 'svg' });
    // ...
  };

  return (
    <Infographic
      ref={ref}
      dsl={{
        data: {
          title: '我的信息图表',
          items: [
            { label: '项目 1', value: 100 },
          ],
        },
      }}
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

#### Props

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `children` | `string` | 是 | - | 要包裹的子组件。 |
| `fallback` | `string \\| ((error: Error, errorInfo: ErrorInfo) => ReactNode)` | 否 | - | 自定义回退 UI。 |
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
- `props: InfographicProps` - 配置信息图表的属性

#### 返回值

包含以下方法的对象：

- `toDataURL(options?: ExportOptions): Promise<string>`
- `getTypes(): string[] | undefined`
- `update(options: Partial<InfographicOptions>): void`
- `destroy(): void`

#### 示例

```tsx
import { useRef, useCallback } from 'react';
import { useInfographic } from 'infographic-for-react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const infographic = useInfographic(containerRef, {
    dsl: {
      data: {
        title: '我的信息图表',
        items: [
          { label: '项目 1', value: 100 },
        ],
      },
    },
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

- `render(options?: Partial<InfographicOptions>): void`
- `update(options: Partial<InfographicOptions>): void`
- `toDataURL(options?: ExportOptions): Promise<string>`
- `getTypes(): string[] | undefined`
- `destroy(): void`
- `on(event: string, listener: Function): void`
- `off(event: string, listener: Function): void`
- `isReady: boolean`

---

## 工具函数

### `applyOverrides(dsl: DSLObject, overrides: DSLOverride[]): DSLObject`

将路径-值覆盖应用到 DSL 对象。

#### 示例

```tsx
import { applyOverrides } from 'infographic-for-react';

const dsl = {
  data: {
    title: { text: '旧标题' }
  }
};
const overrides = [
  { path: 'data.title.text', value: '新标题' }
];

const updated = applyOverrides(dsl, overrides);
// => { data: { title: { text: '新标题' } } }
```

---

### `mergeDSL(dsl1: DSLObject, dsl2: DSLObject): DSLObject`

深度合并两个 DSL 对象。

#### 示例

```tsx
import { mergeDSL } from 'infographic-for-react';

const dsl1 = { a: 1, b: { x: 10 } };
const dsl2 = { b: { y: 20 }, c: 3 };

const merged = mergeDSL(dsl1, dsl2);
// => { a: 1, b: { x: 10, y: 20 }, c: 3 }
```

---

### `composeTemplates(options: ComposeTemplateOptions): DSLObject`

将多个模板组合成单个 DSL 对象。

#### 参数

- `templates: DSLObject[]` - 要组合的 DSL 对象数组
- `overrides?: DSLOverride[]` - 可选的要应用的覆盖

#### 示例

```tsx
import { composeTemplates } from 'infographic-for-react';

const headerDSL = { /* 头部配置 */ };
const bodyDSL = { /* 主体配置 */ };
const footerDSL = { /* 底部配置 */ };

const composed = composeTemplates({
  templates: [headerDSL, bodyDSL, footerDSL],
  overrides: [{ path: 'some.value', value: 123 }]
});
```

---

## 类型

### `DSLInput`

DSL 输入类型，可以是字符串或对象。

```ts
type DSLInput = string | DSLObject;
```

- **字符串**：原生信息图表 DSL 语法。更简洁，适合基于模板的配置。使用字符串 DSL 时，`overrides` 和 `beforeRender` 会被忽略。
- **Children（推荐）**：通过组件的 `children` prop 传递的字符串 DSL。提供了类似 HTML 模板的语法，更直观且保留格式。使用模板字符串包裹 DSL 内容以保留换行和缩进。使用 children DSL 时，`overrides` 和 `beforeRender` 会被忽略，且 `dsl` prop 会被忽略（children 优先级更高）。
- **对象**：结构化的 DSL 对象，提供完整的 TypeScript 类型支持。支持通过 `overrides` 和 `beforeRender` 钩子进行动态修改。

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
type PreRenderHook = (dsl: DSLObject) => DSLObject | Promise<DSLObject>;
```

### `PostRenderHook`

```ts
type PostRenderHook = (result: InfographicRenderResult) => void | Promise<void>;
```
