# @antv/infographic-react

> React components for @antv/infographic - a declarative, component-based wrapper for infographic generation.

[![npm version](https://img.shields.io/npm/v/@antv/infographic-react.svg)](https://www.npmjs.com/package/@antv/infographic-react)
[![license](https://img.shields.io/npm/l/@antv/infographic-react.svg)](https://github.com/lyw405/infographic-for-react/blob/main/LICENSE)

## Features

- **🎯 Declarative API** - Use React components to render infographics with familiar patterns
- **⚡ Lightweight** - Thin wrapper around the core infographic engine with minimal overhead
- **🔌 Flexible Input** - Support for raw DSL strings, built-in templates, or template names
- **🔧 Customizable** - Override DSL values with path-based API, apply themes and palettes
- **🪝 Extensible** - `beforeRender` / `afterRender` hooks for custom preprocessing/postprocessing
- **📦 Export Ready** - Built-in export to SVG/PNG data URLs
- **🛡️ Error Handling** - Built-in error boundaries and error recovery
- **🎨 Fully Typed** - Full TypeScript support with type-safe APIs

## Installation

```bash
npm install @antv/infographic-react @antv/infographic
```

## Quick Start

### Basic Usage

```tsx
import { Infographic } from '@antv/infographic-react';

function App() {
  const dsl = JSON.stringify({
    design: {
      title: {
        component: 'Title',
        props: { text: 'My Infographic' },
      },
      items: [
        {
          name: 'SimpleItem',
          component: 'SimpleItem',
          props: { label: 'Item 1', value: 100 },
        },
      ],
      structure: {
        component: 'Flex',
        props: { direction: 'column' },
      },
    },
    data: {},
  });

  return <Infographic dsl={dsl} width={600} height={400} />;
}
```

### Using Templates

```tsx
import { Infographic } from '@antv/infographic-react';

function App() {
  return (
    <Infographic
      template="list-zigzag"
      width={800}
      height={600}
      theme="modern"
    />
  );
}
```

### DSL Overrides

```tsx
import { Infographic } from '@antv/infographic-react';

function App() {
  const dsl = JSON.stringify({ /* base DSL */ });

  const overrides = [
    { path: 'design.title.props.text', value: 'Custom Title' },
    { path: 'design.items[0].props.value', value: 200 },
  ];

  return <Infographic dsl={dsl} overrides={overrides} />;
}
```

### Using Hooks

```tsx
import { useInfographic } from '@antv/infographic-react';
import { useRef } from 'react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const infographic = useInfographic(containerRef, {
    dsl: '...',
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

```tsx
import { Infographic } from '@antv/infographic-react';

function App() {
  const beforeRender = (dsl: string) => {
    const parsed = JSON.parse(dsl);
    parsed.design.title.props.text = 'Processed: ' + parsed.design.title.props.text;
    return JSON.stringify(parsed);
  };

  const afterRender = async (result) => {
    console.log('Rendered element:', result.node);
    console.log('Element count:', result.node.children.length);
  };

  return (
    <Infographic
      dsl={dsl}
      beforeRender={beforeRender}
      afterRender={afterRender}
    />
  );
}
```

## API Reference

See [API.md](./docs/API.md) for detailed API documentation.

## Examples

- [Basic Usage](./examples/basic.tsx)
- [Template Example](./examples/template.tsx)
- [DSL Overrides](./examples/overrides.tsx)
- [Hooks Usage](./examples/hooks.tsx)

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
