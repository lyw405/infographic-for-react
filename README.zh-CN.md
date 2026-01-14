# @antv/infographic-react

> React 组件库 for @antv/infographic - 基于组件化的声明式信息图表生成封装。

[![npm version](https://img.shields.io/npm/v/@antv/infographic-react.svg)](https://www.npmjs.com/package/@antv/infographic-react)
[![license](https://img.shields.io/npm/l/@antv/infographic-react.svg)](https://github.com/lyw405/infographic-for-react/blob/main/LICENSE)

## 特性

- **🎯 声明式 API** - 使用熟悉的 React 组件模式渲染信息图表
- **⚡ 轻量级** - 核心信息图表引擎的轻量级封装，开销最小
- **🔌 灵活输入** - 支持原始 DSL 字符串、内置模板或模板名称
- **🔧 可定制** - 基于路径的 API 覆盖 DSL 值，应用主题和调色板
- **🪝 可扩展** - `beforeRender` / `afterRender` 钩子用于自定义预处理/后处理
- **📦 导出就绪** - 内置导出为 SVG/PNG 数据 URL
- **🛡️ 错误处理** - 内置错误边界和错误恢复
- **🎨 完整类型** - 完整的 TypeScript 支持和类型安全 API

## 安装

```bash
npm install @antv/infographic-react @antv/infographic
```

## 快速开始

### 基础用法

```tsx
import { Infographic } from '@antv/infographic-react';

function App() {
  const dsl = JSON.stringify({
    design: {
      title: {
        component: 'Title',
        props: { text: '我的信息图表' },
      },
      items: [
        {
          name: 'SimpleItem',
          component: 'SimpleItem',
          props: { label: '项目 1', value: 100 },
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

### 使用模板

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

### DSL 覆盖

```tsx
import { Infographic } from '@antv/infographic-react';

function App() {
  const dsl = JSON.stringify({ /* 基础 DSL */ });

  const overrides = [
    { path: 'design.title.props.text', value: '自定义标题' },
    { path: 'design.items[0].props.value', value: 200 },
  ];

  return <Infographic dsl={dsl} overrides={overrides} />;
}
```

### 使用 Hooks

```tsx
import { useInfographic } from '@antv/infographic-react';
import { useRef } from 'react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const infographic = useInfographic(containerRef, {
    dsl: '...',
    onRender: (result) => console.log('已渲染:', result),
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
      <button onClick={handleExport}>导出 SVG</button>
      <div ref={containerRef} style={{ width: 600, height: 400 }} />
    </div>
  );
}
```

### 渲染前/后钩子

```tsx
import { Infographic } from '@antv/infographic-react';

function App() {
  const beforeRender = (dsl: string) => {
    const parsed = JSON.parse(dsl);
    parsed.design.title.props.text = '已处理: ' + parsed.design.title.props.text;
    return JSON.stringify(parsed);
  };

  const afterRender = async (result) => {
    console.log('渲染的元素:', result.node);
    console.log('元素数量:', result.node.children.length);
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

## API 参考

详细 API 文档请参阅 [API.md](./docs/API.md)。

## 示例

- [基础用法](./examples/basic.tsx)
- [模板示例](./examples/template.tsx)
- [DSL 覆盖](./examples/overrides.tsx)
- [Hooks 用法](./examples/hooks.tsx)

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 格式化代码
npm run format
```

## 贡献

欢迎贡献！提交 PR 之前请阅读我们的贡献指南。

## 许可证

[MIT](LICENSE) © lyw405

## 仓库地址

[GitHub](https://github.com/lyw405/infographic-for-react)
