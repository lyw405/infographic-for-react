import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRefMethods } from '../../../src/hooks/useRefMethods';

const mockUpdate = vi.fn();
const mockProcessDSL = vi.fn().mockResolvedValue({
  data: { title: 'Test', items: [] },
  theme: 'light',
  themeConfig: {},
});

describe('useRefMethods - String DSL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pass string DSL directly to update', async () => {
    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    const stringDsl = 'infographic test\ndata\n  title Test';
    await result.current.refUpdate(stringDsl);

    expect(mockUpdate).toHaveBeenCalledWith(stringDsl);
    expect(mockProcessDSL).not.toHaveBeenCalled();
  });

  it('should not process string DSL through processDSL', async () => {
    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    await result.current.refUpdate(
      'infographic test\ndata\n  title Test\n  items\n    - label Item 1\n      value 100',
    );

    expect(mockProcessDSL).not.toHaveBeenCalled();
  });

  it('should process object DSL normally', async () => {
    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    const objectDsl = { data: { title: 'Test', items: [] } };
    await result.current.refUpdate(objectDsl);

    expect(mockProcessDSL).toHaveBeenCalledWith(objectDsl);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { title: 'Test', items: [] },
        theme: 'light',
      }),
    );
  });

  it('should use theme from context when processing object DSL', async () => {
    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'custom-theme',
      }),
    );

    await result.current.refUpdate({ data: { title: 'Test', items: [] } });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'light',
      }),
    );
  });

  it('should use context theme when object DSL has no theme', async () => {
    mockProcessDSL.mockResolvedValueOnce({
      data: { title: 'Test', items: [] },
      themeConfig: {},
    });

    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    await result.current.refUpdate({ data: { title: 'Test', items: [] } });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
      }),
    );
  });

  it('should handle complex string DSL with theme and palette', async () => {
    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    const complexStringDsl = `
infographic sequence-circular-underline-text
theme light
  palette antv
data
  title 企业优势列表
  items
    - label 品牌影响力
      value 85
    - label 技术研发力
      value 90
`;

    await result.current.refUpdate(complexStringDsl);

    expect(mockUpdate).toHaveBeenCalledWith(complexStringDsl);
    expect(mockProcessDSL).not.toHaveBeenCalled();
  });

  it('should handle minimal string DSL', async () => {
    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    const minimalDsl = 'infographic test\ndata\n  title Test';
    await result.current.refUpdate(minimalDsl);

    expect(mockUpdate).toHaveBeenCalledWith(minimalDsl);
  });
});

describe('useRefMethods - Ref Update Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle multiple rapid refUpdate calls with string DSL', async () => {
    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    await result.current.refUpdate('infographic test\ndata\n  title Test1');
    await result.current.refUpdate('infographic test\ndata\n  title Test2');
    await result.current.refUpdate('infographic test\ndata\n  title Test3');

    expect(mockUpdate).toHaveBeenCalledTimes(3);
    expect(mockUpdate).toHaveBeenNthCalledWith(
      1,
      'infographic test\ndata\n  title Test1',
    );
    expect(mockUpdate).toHaveBeenNthCalledWith(
      2,
      'infographic test\ndata\n  title Test2',
    );
    expect(mockUpdate).toHaveBeenNthCalledWith(
      3,
      'infographic test\ndata\n  title Test3',
    );
  });

  it('should handle switching between string and object DSL', async () => {
    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    await result.current.refUpdate('infographic test\ndata\n  title String');
    expect(mockProcessDSL).not.toHaveBeenCalled();

    await result.current.refUpdate({ data: { title: 'Object', items: [] } });
    expect(mockProcessDSL).toHaveBeenCalledTimes(1);

    await result.current.refUpdate('infographic test\ndata\n  title String2');
    expect(mockProcessDSL).toHaveBeenCalledTimes(1);
  });

  it('should preserve context theme across multiple updates', async () => {
    mockProcessDSL.mockResolvedValue({
      data: { title: 'Test', items: [] },
      themeConfig: {},
    });

    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'custom-theme',
      }),
    );

    await result.current.refUpdate({ data: { title: 'Test1', items: [] } });
    await result.current.refUpdate({ data: { title: 'Test2', items: [] } });

    expect(mockUpdate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ theme: 'custom-theme' }),
    );
    expect(mockUpdate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ theme: 'custom-theme' }),
    );
  });

  it('should handle processDSL errors gracefully', async () => {
    mockProcessDSL.mockRejectedValueOnce(new Error('Processing failed'));

    const { result } = renderHook(() =>
      useRefMethods(mockUpdate, {
        processDSL: mockProcessDSL,
        theme: 'dark',
      }),
    );

    await expect(
      result.current.refUpdate({ data: { title: 'Test', items: [] } }),
    ).rejects.toThrow('Processing failed');
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
