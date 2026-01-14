# infographic-for-react

> React 组件库 for @antv/infographic - 基于组件化的声明式信息图表生成封装。

[English documentation](./README.md)

[![npm version](https://img.shields.io/npm/v/infographic-for-react.svg)](https://www.npmjs.com/package/infographic-for-react)

## 特性

- **🎯 声明式 API** - 使用熟悉的 React 组件模式渲染信息图表
- **⚡ 轻量级** - 核心信息图表引擎的轻量级封装，开销最小
- **🔧 可定制** - 基于路径的 API 覆盖 DSL 值，应用主题和调色板
- **🪝 可扩展** - `beforeRender` / `afterRender` 钩子用于自定义预处理/后处理
- **📦 导出就绪** - 内置导出为 SVG/PNG 数据 URL
- **🛡️ 错误处理** - 内置错误边界和错误恢复
- **🎨 完整类型** - 完整的 TypeScript 支持和类型安全 API

## 安装

```bash
# 安装 infographic-for-react 及其 peer dependency @antv/infographic
npm install infographic-for-react @antv/infographic
```

> **注意**：`@antv/infographic` 是 peer dependency，需要单独安装。如果你使用 npm v7+，它会自动安装，但我们建议显式安装以确保兼容性。

## 快速开始

### 基础用法

使用 `Infographic` 最简单的方式是传入包含模板名称和数据配置的 `dsl` 属性。

```tsx
import { Infographic } from 'infographic-for-react';

function App() {
  return (
    <Infographic
      dsl={{
        template: '模板名称',
        theme: 'light',
        palette: 'antv',
        data: {
          title: '我的信息图表',
          desc: '可选描述',
          items: [
            {
              label: '项目 1',
              value: 100,
              desc: '项目描述',
              icon: 'mingcute/diamond-2-fill',
              illus: 'creative-experiment',
              time: '2021',
              children: [
                ...
              ],
            },
            { label: '项目 2', value: 200 },
          ],
        },
      }}
      width={600}
      height={400}
    />
  );
}
```

### DSL 覆盖

使用 `overrides` 属性可以通过路径选择性地修改 DSL 值，而无需重新创建整个 DSL 对象。这对于动态更新或主题切换非常有用。

```tsx
import { Infographic } from 'infographic-for-react';

function App() {
  const overrides = [
    { path: 'data.items[0].value', value: 200 },
  ];

  return (
    <Infographic
      dsl={{
        template: '模板名称',
        theme: 'light',
        palette: 'antv',
        data: {
          title: '我的信息图表',
          desc: '可选描述',
          items: [
            {
              label: '项目 1',
              value: 100,
              desc: '项目描述',
              icon: 'mingcute/diamond-2-fill',
              illus: 'creative-experiment',
              time: '2021',
              children: [
                ...,
              ],
            },
            { label: '项目 2', value: 200 },
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

### 使用 Hooks

```tsx
import { useInfographic } from 'infographic-for-react';
import { useRef } from 'react';

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

使用 `beforeRender` 在渲染前预处理 DSL，使用 `afterRender` 在信息图表渲染后执行操作（如日志记录、分析、自定义后处理）。

```tsx
import { Infographic } from 'infographic-for-react';
import type { DSLObject } from 'infographic-for-react';

function App() {
  const beforeRender = (dsl: DSLObject): DSLObject => {
    return {
      ...dsl,
      title: '已处理: ' + dsl.title,
    };
  };

  const afterRender = async (result) => {
    console.log('渲染的元素:', result.node);
    console.log('元素数量:', result.node.children.length);
  };

  return (
    <Infographic
      dsl={{
        title: '我的信息图表',
        data: {
          title: '数据标题',
          items: [{ label: '项目 1', value: 100 }],
        },
      }}
      beforeRender={beforeRender}
      afterRender={afterRender}
    />
  );
}
```

## API 参考

详细 API 文档请参阅 [API.zh-CN.md](./docs/API.zh-CN.md)。

[English documentation](./docs/API.md) is also available.

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
