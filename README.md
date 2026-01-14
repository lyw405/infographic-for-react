# infographic-for-react

> React components for @antv/infographic - a declarative, component-based wrapper for infographic generation.

[中文文档](./README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/infographic-for-react.svg)](https://www.npmjs.com/package/infographic-for-react)

## Features

- **🎯 Declarative API** - Use React components to render infographics with familiar patterns
- **⚡ Lightweight** - Thin wrapper around the core infographic engine with minimal overhead
- **🔧 Customizable** - Override DSL values with path-based API, apply themes and palettes
- **🪝 Extensible** - `beforeRender` / `afterRender` hooks for custom preprocessing/postprocessing
- **📦 Export Ready** - Built-in export to SVG/PNG data URLs
- **🛡️ Error Handling** - Built-in error boundaries and error recovery
- **🎨 Fully Typed** - Full TypeScript support with type-safe APIs

## Installation

```bash
# Install infographic-for-react and its peer dependency @antv/infographic
npm install infographic-for-react @antv/infographic
```

> **Note**: `@antv/infographic` is a peer dependency and must be installed separately. If you use npm v7+, it will be installed automatically, but we recommend explicitly installing it to ensure compatibility.

## Quick Start

### String DSL (Recommended for Static Templates)

Use the native infographic string DSL syntax for a concise, template-based approach.

```tsx
import { Infographic } from 'infographic-for-react';

function App() {
  const dslString = `
infographic sales-dashboard
theme
  palette #f00 #0f0 #00f
data
  title Q1 Growth Highlights
  items
    - label MAU
      value 12.3
    - label Revenue
      value 4.5
`;

  return (
    <Infographic
      dsl={dslString}
      width={600}
      height={400}
    />
  );
}
```

> **Note**: When using string DSL, the `overrides` and `beforeRender` props are ignored. Use object DSL if you need these features.

### Children DSL (Recommended for Most Use Cases)

For a more declarative and React-like syntax, pass DSL as the component's children. This is particularly useful for static templates and provides better readability with preserved formatting.

> **⚠️ Important**: When using children DSL, you **must** wrap DSL content in a template literal `{}` to preserve newlines and indentation. This prevents React from collapsing whitespace.

```tsx
import { Infographic } from 'infographic-for-react';

function App() {
  return (
    <Infographic width={600} height={400}>
      {`infographic list-row-simple-horizontal-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
`}
    </Infographic>
  );
}
```

```tsx
// You can also use template literals for dynamic content with variable interpolation
function App() {
  const title = 'My Dashboard';
  const items = [
    { label: 'MAU', value: 12.3 },
    { label: 'Revenue', value: 4.5 },
  ];

  return (
    <Infographic>
      {`infographic sales-dashboard
data
  title ${title}
  items
${items.map((item) => `    - label ${item.label}\n      value ${item.value}`).join('\n')}`}
    </Infographic>
  );
}
```

> **Note**: When using children DSL, the `overrides` and `beforeRender` props are ignored. Use object DSL if you need these features. The `dsl` prop is also ignored when children are provided (children take precedence).

### Basic Usage (Object DSL)

Use object DSL for full TypeScript type safety and access to advanced features like `overrides` and `beforeRender` hooks.

```tsx
import { Infographic } from 'infographic-for-react';

function App() {
  return (
    <Infographic
      dsl={{
        template: 'template-name',
        theme: 'light',
        palette: 'antv',
        data: {
          title: 'My Infographic',
          desc: 'Optional description',
          items: [
            {
              label: 'Item 1',
              value: 100,
              desc: 'Item description',
              icon: 'mingcute/diamond-2-fill',
              illus: 'creative-experiment',
              time: '2021',
              children: [
                ...,
              ],
            },
            ...,
          ],
        },
      }}
      width={600}
      height={400}
    />
  );
}
```

### DSL Overrides

Use the `overrides` prop to selectively modify DSL values by path without recreating entire DSL object. This is useful for dynamic updates or theming. **Only works with object DSL**.

```tsx
import { Infographic } from 'infographic-for-react';

function App() {
  const overrides = [
    { path: 'data.items[0].value', value: 200 },
  ];

  return (
    <Infographic
      dsl={{
        template: 'template-name',
        theme: 'light',
        palette: 'antv',
        data: {
          title: 'My Infographic',
          desc: 'Optional description',
          items: [
            {
              label: 'Item 1',
              value: 100,
              desc: 'Item description',
              icon: 'mingcute/diamond-2-fill',
              illus: 'creative-experiment',
              time: '2021',
              children: [
                ...,
              ],
            },
            { label: 'Item 2', value: 200 },
          ],
        },
      }}
      overrides={overrides}
      width={600}
      height={400}
    />
  );
}
```

### Using Hooks

```tsx
import { useInfographic } from 'infographic-for-react';
import { useRef } from 'react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const infographic = useInfographic(containerRef, {
    dsl: {
      data: {
        title: 'My Infographic',
        items: [
          { label: 'Item 1', value: 100 },
        ],
      },
    },
    onRender: (result) => console.log('Rendered:', result),
  });

  const handleExport = async () => {
    const dataURL = await infographic.toDataURL({ type: 'svg' });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'infographic.svg';
    link.click();
  };

  return (
    <div>
      <button onClick={handleExport}>Export SVG</button>
      <div ref={containerRef} style={{ width: 600, height: 400 }} />
    </div>
  );
}
```

### Pre/Post Render Hooks

Use `beforeRender` to preprocess DSL before rendering, and `afterRender` to perform actions after infographic is rendered (e.g., logging, analytics, custom post-processing). **Only works with object DSL**.

```tsx
import { Infographic } from 'infographic-for-react';
import type { DSLObject } from 'infographic-for-react';

function App() {
  const beforeRender = (dsl: DSLObject): DSLObject => {
    return {
      ...dsl,
      title: 'Processed: ' + dsl.title,
    };
  };

  const afterRender = async (result) => {
    console.log('Rendered element:', result.node);
    console.log('Element count:', result.node.children.length);
  };

  return (
    <Infographic
      dsl={{
        data: {
          title: 'My Infographic',
          items: [{ label: 'Item 1', value: 100 }],
        },
      }}
      beforeRender={beforeRender}
      afterRender={afterRender}
    />
  );
}
```

## API Reference

See [API.md](./docs/API.md) for detailed API documentation.

[中文文档](./docs/API.zh-CN.md) is also available.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

[MIT](LICENSE) © lyw405

## Repository

[GitHub](https://github.com/lyw405/infographic-for-react)
