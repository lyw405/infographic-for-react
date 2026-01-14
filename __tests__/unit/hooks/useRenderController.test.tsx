import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRenderController } from '../../../src/hooks/useRenderController';

const mockRendererRender = vi.fn();
const mockProcessDSL = vi.fn().mockResolvedValue({
  data: { title: 'Test', items: [] },
  theme: 'light',
});

describe('useRenderController - String DSL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('should accept string DSL and pass directly to renderer', async () => {
    const containerRef = { current: document.createElement('div') };
    const props = {
      dsl: 'infographic test\ndata\n  title Test',
    };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockRendererRender).toHaveBeenCalledWith(
      'infographic test\ndata\n  title Test',
    );
  });

  it('should trim whitespace from string DSL', async () => {
    const containerRef = { current: document.createElement('div') };
    const props = {
      dsl: '  \n  infographic test\n  data\n    title Test\n  \n  ',
    };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockRendererRender).toHaveBeenCalledWith(
      expect.stringContaining('infographic test'),
    );
  });

  it('should cache string DSL and avoid redundant renders', async () => {
    const containerRef = { current: document.createElement('div') };
    const props = {
      dsl: 'infographic test\ndata\n  title Test',
    };

    const { result, rerender } = renderHook(
      (props) =>
        useRenderController(
          containerRef,
          mockRendererRender,
          props,
          mockProcessDSL,
        ),
      { initialProps: props },
    );

    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(mockRendererRender).toHaveBeenCalledTimes(1);

    rerender(props);
    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(mockRendererRender).toHaveBeenCalledTimes(1);

    const newProps = { dsl: 'infographic test2\ndata\n  title Test2' };
    rerender(newProps);
    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(mockRendererRender).toHaveBeenCalledTimes(2);
    expect(mockRendererRender).toHaveBeenCalledWith(
      'infographic test2\ndata\n  title Test2',
    );
  });

  it('should apply className to container with string DSL', async () => {
    const container = document.createElement('div');
    container.setAttribute('data-infographic-container', 'true');
    const containerRef = { current: container };
    const props = {
      dsl: 'infographic test\ndata\n  title Test',
      className: 'custom-class',
    };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(containerRef.current.className).toBe('custom-class');
  });

  it('should not call processDSL for string DSL', async () => {
    const containerRef = { current: document.createElement('div') };
    const props = {
      dsl: 'infographic test\ndata\n  title Test',
    };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockProcessDSL).not.toHaveBeenCalled();
  });
});

describe('useRenderController - String DSL with Complex Examples', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('should handle multi-line string DSL with items', async () => {
    const containerRef = { current: document.createElement('div') };
    const stringDsl = `
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
`;

    const props = { dsl: stringDsl };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockRendererRender).toHaveBeenCalledTimes(1);
    const calledWith = mockRendererRender.mock.calls[0][0];
    expect(calledWith).toContain('infographic sequence-circular-underline-text');
    expect(calledWith).toContain('label 品牌影响力');
    expect(calledWith).toContain('palette antv');
  });

  it('should handle string DSL with theme configuration', async () => {
    const containerRef = { current: document.createElement('div') };
    const stringDsl = `
infographic test-template
theme light
  palette antv
  colorPrimary #1890ff
data
  title Test Title
  items
    - label Item 1
      value 100
`;

    const props = { dsl: stringDsl };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockRendererRender).toHaveBeenCalledTimes(1);
    const calledWith = mockRendererRender.mock.calls[0][0];
    expect(calledWith).toContain('theme light');
    expect(calledWith).toContain('palette antv');
    expect(calledWith).toContain('colorPrimary #1890ff');
  });

  it('should handle string DSL with nested data structures', async () => {
    const containerRef = { current: document.createElement('div') };
    const stringDsl = `
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
`;

    const props = { dsl: stringDsl };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockRendererRender).toHaveBeenCalledTimes(1);
    const calledWith = mockRendererRender.mock.calls[0][0];
    expect(calledWith).toContain('children');
    expect(calledWith).toContain('Child 1.1');
    expect(calledWith).toContain('Child 1.2');
  });

  it('should handle string DSL with template specification', async () => {
    const containerRef = { current: document.createElement('div') };
    const stringDsl = `
infographic sales-dashboard
data
  title Q1 Sales Report
  items
    - label Revenue
      value 50000
    - label Growth
      value 15
theme dark
`;

    const props = { dsl: stringDsl };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockRendererRender).toHaveBeenCalledTimes(1);
    const calledWith = mockRendererRender.mock.calls[0][0];
    expect(calledWith).toContain('infographic sales-dashboard');
    expect(calledWith).toContain('theme dark');
  });

  it('should handle string DSL with width and height', async () => {
    const containerRef = { current: document.createElement('div') };
    const stringDsl = `
infographic test
width 800
height 600
data
  title Test
  items
    - label Item 1
      value 100
`;

    const props = { dsl: stringDsl };

    const { result } = renderHook(() =>
      useRenderController(
        containerRef,
        mockRendererRender,
        props,
        mockProcessDSL,
      ),
    );

    act(() => {
      result.current.debouncedRender();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockRendererRender).toHaveBeenCalledTimes(1);
    const calledWith = mockRendererRender.mock.calls[0][0];
    expect(calledWith).toContain('width 800');
    expect(calledWith).toContain('height 600');
  });
});
