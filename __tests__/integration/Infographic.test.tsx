import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Infographic } from '../../src/components';

const mockRenderer = {
  render: vi.fn(),
  update: vi.fn(),
  toDataURL: vi.fn().mockResolvedValue('data:image/svg+xml;base64,test'),
  getTypes: vi.fn(() => ['test-type']),
  destroy: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('../../src/hooks/useRenderer', () => ({
  useRenderer: () => ({
    render: vi.fn(),
    update: vi.fn(),
    toDataURL: mockRenderer.toDataURL,
    getTypes: mockRenderer.getTypes,
    destroy: mockRenderer.destroy,
  }),
}));

vi.mock('../../src/hooks/useInfographic', () => ({
  useInfographic: () => ({
    toDataURL: mockRenderer.toDataURL,
    getTypes: mockRenderer.getTypes,
    update: mockRenderer.update,
    destroy: mockRenderer.destroy,
  }),
}));

describe('Infographic Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render container element', () => {
    const { container } = render(
      <Infographic dsl={{ data: { title: 'Test', items: [] } }} />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Infographic dsl={{ data: { title: 'Test', items: [] } }} className="custom-class" />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toHaveClass('custom-class');
  });

  it('should apply custom width and height', () => {
    const { container } = render(
      <Infographic dsl={{ data: { title: 'Test', items: [] } }} width={800} height={600} />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toHaveStyle({ width: '800px', height: '600px' });
  });

  it('should expose ref methods', () => {
    const ref: any = { current: null };
    render(<Infographic dsl={{ data: { title: 'Test', items: [] } }} ref={ref} />);

    expect(ref.current).toBeDefined();
    expect(typeof ref.current.toDataURL).toBe('function');
    expect(typeof ref.current.update).toBe('function');
    expect(typeof ref.current.destroy).toBe('function');
    expect(typeof ref.current.getTypes).toBe('function');
  });

  it('should support string DSL', () => {
    const { container } = render(
      <Infographic
        dsl={`
infographic test-template
data
  title Test
  items
    - label Item 1
      value 100
`}
      />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should trim whitespace from string DSL', () => {
    const { container } = render(
      <Infographic dsl={'  \n  infographic test\n  data\n    title Test\n  \n  '} />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should render container with string DSL and custom props', () => {
    const { container } = render(
      <Infographic
        dsl="infographic test\ndata\n  title Test"
        className="string-dsl-class"
        width={500}
        height={300}
      />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
    expect(divElement).toHaveClass('string-dsl-class');
    expect(divElement).toHaveStyle({ width: '500px', height: '300px' });
  });

  it('should handle complex string DSL with Chinese characters', () => {
    const { container } = render(
      <Infographic
        dsl={`
infographic sequence-circular-underline-text
data
  title 企业优势列表
  desc 展示企业在不同维度上的核心优势与表现值
  items
    - label 品牌影响力
      value 85
      desc 在目标用户群中具备较强认知与信任度
      time 2021
      icon mingcute/diamond-2-fill
      illus creative-experiment
    - label 技术研发力
      value 90
      desc 拥有自研核心系统与持续创新能力
      time 2022
      icon mingcute/code-fill
      illus code-thinking
theme light
  palette antv
`}
      />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should handle string DSL with theme configuration', () => {
    const { container } = render(
      <Infographic
        dsl={`
infographic test-template
theme light
  palette antv
  colorPrimary #1890ff
data
  title Test Title
  items
    - label Item 1
      value 100
`}
      />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should handle string DSL with nested data structures', () => {
    const { container } = render(
      <Infographic
        dsl={`
infographic test
data
  title Main Title
  desc Main Description
  items
    - label Parent 1
      value 100
      desc Parent description
      children
        - label Child 1.1
          value 50
        - label Child 1.2
          value 50
    - label Parent 2
      value 200
      desc Another parent
`}
      />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should handle string DSL with width and height', () => {
    const { container } = render(
      <Infographic
        dsl={`
infographic test
width 800
height 600
data
  title Test
  items
    - label Item 1
      value 100
`}
      />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should handle string DSL with template specification', () => {
    const { container } = render(
      <Infographic
        dsl={`
infographic sales-dashboard
data
  title Q1 Sales Report
  items
    - label Revenue
      value 50000
    - label Growth
      value 15
theme dark
`}
      />,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should support ref update with string DSL', () => {
    const ref: any = { current: null };
    render(<Infographic dsl={{ data: { title: 'Test', items: [] } }} ref={ref} />);

    expect(ref.current.update).toBeDefined();

    ref.current.update(`
infographic test-template
data
  title Updated Title
  items
    - label Updated Item
      value 200
`);
  });

  it('should render container with children DSL', () => {
    const { container } = render(
      <Infographic width={600} height={400}>
infographic list-row-simple-horizontal-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
      </Infographic>,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
    expect(divElement).toHaveStyle({ width: '600px', height: '400px' });
  });

  it('should handle children DSL with whitespace trimming', () => {
    const { container } = render(
      <Infographic>
        {'  \n  infographic test\n  data\n    title Test\n    items\n      - label Item 1\n  \n  '}
      </Infographic>,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should apply className when using children DSL', () => {
    const { container } = render(
      <Infographic className="children-dsl-class">
infographic test
data
  title Test
      </Infographic>,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
    expect(divElement).toHaveClass('children-dsl-class');
  });

  it('should handle complex children DSL with Chinese characters', () => {
    const { container } = render(
      <Infographic width={800} height={600}>
infographic sequence-circular-underline-text
data
  title 企业优势列表
  desc 展示企业在不同维度上的核心优势与表现值
  items
    - label 品牌影响力
      value 85
      desc 在目标用户群中具备较强认知与信任度
      time 2021
      icon mingcute/diamond-2-fill
      illus creative-experiment
    - label 技术研发力
      value 90
      desc 拥有自研核心系统与持续创新能力
      time 2022
      icon mingcute/code-fill
      illus code-thinking
theme light
  palette antv
      </Infographic>,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should prefer children over dsl prop when both are provided', () => {
    const { container } = render(
      <Infographic
        dsl={{
          data: { title: 'Prop DSL', items: [{ label: 'Item 1', value: 100 }] },
        }}
      >
infographic test-template
data
  title Children DSL
  items
    - label Children Item
      value 200
      </Infographic>,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should throw error when neither children nor dsl prop is provided', () => {
    expect(() => {
      render(<Infographic width={600} height={400} />);
    }).toThrow('Either children or dsl prop must be provided');
  });

  it('should support ref methods when using children DSL', () => {
    const ref: any = { current: null };
    render(
      <Infographic ref={ref}>
infographic test
data
  title Test
  items
    - label Item 1
      value 100
      </Infographic>,
    );

    expect(ref.current).toBeDefined();
    expect(typeof ref.current.toDataURL).toBe('function');
    expect(typeof ref.current.update).toBe('function');
    expect(typeof ref.current.destroy).toBe('function');
    expect(typeof ref.current.getTypes).toBe('function');
  });

  it('should handle children DSL with template string interpolation', () => {
    const items = [
      { label: 'Step 1', desc: 'Start' },
      { label: 'Step 2', desc: 'In Progress' },
    ];
    const { container } = render(
      <Infographic>
        {`infographic test
data
  title Test
  items
    ${items.map((item) => `- label ${item.label}\n      desc ${item.desc}`).join('\n    ')}`}
      </Infographic>,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should handle empty children as error', () => {
    expect(() => {
      render(<Infographic>{'  \n  '}</Infographic>);
    }).toThrow();
  });

  it('should handle children with nested data structures', () => {
    const { container } = render(
      <Infographic>
infographic test
data
  title Main Title
  desc Main Description
  items
    - label Parent 1
      value 100
      desc Parent description
      children
        - label Child 1.1
          value 50
        - label Child 1.2
          value 50
      </Infographic>,
    );
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });
});
