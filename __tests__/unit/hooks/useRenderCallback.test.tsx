import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRenderCallback } from '../../../src/hooks/useRenderCallback';
import type { InfographicRenderResult } from '../../../src/types';

describe('useRenderCallback', () => {
  const mockOnRender = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockResult: InfographicRenderResult = {
    node: document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement,
    options: {},
  };

  it('should call onRender and onLoad after render', async () => {
    const mockOnLoad = vi.fn();
    const { result } = renderHook(() =>
      useRenderCallback({
        afterRender: undefined,
        onRender: mockOnRender,
        onLoad: mockOnLoad,
        onError: mockOnError,
      }),
    );

    await act(async () => {
      await result.current.handleRendered(mockResult);
    });

    expect(mockOnRender).toHaveBeenCalledWith(mockResult);
    expect(mockOnLoad).toHaveBeenCalledWith(mockResult);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should call afterRender hook', async () => {
    const mockAfterRender = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRenderCallback({
        afterRender: mockAfterRender,
        onRender: mockOnRender,
        onLoad: undefined,
        onError: mockOnError,
      }),
    );

    await act(async () => {
      await result.current.handleRendered(mockResult);
    });

    expect(mockAfterRender).toHaveBeenCalledWith(mockResult);
    expect(mockOnRender).toHaveBeenCalledWith(mockResult);
  });

  it('should call onError when afterRender fails', async () => {
    const error = new Error('After render failed');
    const mockAfterRender = vi.fn().mockRejectedValue(error);

    const { result } = renderHook(() =>
      useRenderCallback({
        afterRender: mockAfterRender,
        onRender: mockOnRender,
        onLoad: undefined,
        onError: mockOnError,
      }),
    );

    await act(async () => {
      await result.current.handleRendered(mockResult);
    });

    expect(mockAfterRender).toHaveBeenCalledWith(mockResult);
    expect(mockOnRender).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'runtime',
        message: 'afterRender hook failed: After render failed',
      }),
    );
  });

  it('should handle async afterRender', async () => {
    const mockAfterRender = vi.fn().mockImplementation(
      () => new Promise<void>((resolve) => setTimeout(() => resolve(), 10)),
    );

    const { result } = renderHook(() =>
      useRenderCallback({
        afterRender: mockAfterRender,
        onRender: mockOnRender,
        onLoad: undefined,
        onError: mockOnError,
      }),
    );

    await act(async () => {
      await result.current.handleRendered(mockResult);
    });

    expect(mockAfterRender).toHaveBeenCalledWith(mockResult);
    expect(mockOnRender).toHaveBeenCalledWith(mockResult);
  });

  it('should work without any callbacks', async () => {
    const { result } = renderHook(() =>
      useRenderCallback({
        afterRender: undefined,
        onRender: undefined,
        onLoad: undefined,
        onError: mockOnError,
      }),
    );

    await act(async () => {
      await result.current.handleRendered(mockResult);
    });

    expect(mockOnError).not.toHaveBeenCalled();
  });
});
