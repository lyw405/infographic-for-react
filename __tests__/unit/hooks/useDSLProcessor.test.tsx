import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDSLProcessor } from '../../../src/hooks/useDSLProcessor';
import { applyOverrides } from '../../../src/utils/dsl';
import type { DSLObject, DSLOverride } from '../../../src/types';

vi.mock('../../../src/utils/dsl', () => ({
  applyOverrides: vi.fn(),
}));

describe('useDSLProcessor', () => {
  const mockOnError = vi.fn();
  const mockBeforeRender = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process DSL without overrides or beforeRender', async () => {
    const { result } = renderHook(() =>
      useDSLProcessor({
        overrides: undefined,
        beforeRender: undefined,
        onError: mockOnError,
      }),
    );

    const dsl: DSLObject = {
      data: { title: 'Test', items: [] },
    };

    const processed = await result.current.processDSL(dsl);

    expect(processed).toEqual(dsl);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should apply overrides to DSL', async () => {
    const overrides: DSLOverride[] = [{ path: 'data.title', value: 'Modified' }];
    vi.mocked(applyOverrides).mockImplementation((dsl) => ({ ...dsl, data: { ...dsl.data, title: 'Modified' } }));

    const { result } = renderHook(() =>
      useDSLProcessor({
        overrides,
        beforeRender: undefined,
        onError: mockOnError,
      }),
    );

    const dsl: DSLObject = {
      data: { title: 'Test', items: [] },
    };

    const processed = await result.current.processDSL(dsl);

    expect(applyOverrides).toHaveBeenCalledWith(dsl, overrides);
    expect(processed.data.title).toBe('Modified');
  });

  it('should call onError when overrides fail', async () => {
    const error = new Error('Override failed');
    vi.mocked(applyOverrides).mockImplementation(() => {
      throw error;
    });

    const { result } = renderHook(() =>
      useDSLProcessor({
        overrides: [{ path: 'data.title', value: 'Modified' }],
        beforeRender: undefined,
        onError: mockOnError,
      }),
    );

    const dsl: DSLObject = {
      data: { title: 'Test', items: [] },
    };

    await expect(result.current.processDSL(dsl)).rejects.toThrow();
    expect(mockOnError).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'syntax',
        message: 'Failed to apply overrides: Override failed',
      }),
    );
  });

  it('should call beforeRender hook', async () => {
    const modifiedDSL: DSLObject = { data: { title: 'Modified', items: [] } };
    mockBeforeRender.mockResolvedValue(modifiedDSL);

    const { result } = renderHook(() =>
      useDSLProcessor({
        overrides: undefined,
        beforeRender: mockBeforeRender,
        onError: mockOnError,
      }),
    );

    const dsl: DSLObject = {
      data: { title: 'Test', items: [] },
    };

    const processed = await result.current.processDSL(dsl);

    expect(mockBeforeRender).toHaveBeenCalledWith(dsl);
    expect(processed).toEqual(modifiedDSL);
  });

  it('should call onError when beforeRender fails', async () => {
    const error = new Error('Before render failed');
    mockBeforeRender.mockRejectedValue(error);

    const { result } = renderHook(() =>
      useDSLProcessor({
        overrides: undefined,
        beforeRender: mockBeforeRender,
        onError: mockOnError,
      }),
    );

    const dsl: DSLObject = {
      data: { title: 'Test', items: [] },
    };

    await expect(result.current.processDSL(dsl)).rejects.toThrow();
    expect(mockOnError).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'runtime',
        message: 'beforeRender hook failed: Before render failed',
      }),
    );
  });

  it('should apply overrides before calling beforeRender', async () => {
    const overrides: DSLOverride[] = [{ path: 'data.title', value: 'Overridden' }];
    const afterOverrideDSL: DSLObject = { data: { title: 'Overridden', items: [] } };
    const afterBeforeRenderDSL: DSLObject = { data: { title: 'Processed', items: [] } };

    vi.mocked(applyOverrides).mockReturnValue(afterOverrideDSL);
    mockBeforeRender.mockResolvedValue(afterBeforeRenderDSL);

    const { result } = renderHook(() =>
      useDSLProcessor({
        overrides,
        beforeRender: mockBeforeRender,
        onError: mockOnError,
      }),
    );

    const dsl: DSLObject = {
      data: { title: 'Test', items: [] },
    };

    const processed = await result.current.processDSL(dsl);

    expect(applyOverrides).toHaveBeenCalledWith(dsl, overrides);
    expect(mockBeforeRender).toHaveBeenCalledWith(afterOverrideDSL);
    expect(processed).toEqual(afterBeforeRenderDSL);
  });
});
