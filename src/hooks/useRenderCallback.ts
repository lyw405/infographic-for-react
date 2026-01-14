import { useCallback, useRef } from 'react';
import { createInfographicError, formatErrorMessage } from '../utils/error';
import type { InfographicError, InfographicRenderResult, PostRenderHook } from '../types';

interface RenderCallbackOptions {
  afterRender?: PostRenderHook;
  onRender?: (result: InfographicRenderResult) => void;
  onLoad?: (result: InfographicRenderResult) => void;
  onError?: (error: InfographicError) => void;
}

export function useRenderCallback(options: RenderCallbackOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleRendered = useCallback(
    async (result: InfographicRenderResult) => {
      const { afterRender, onRender, onLoad } = optionsRef.current;

      if (afterRender) {
        try {
          await afterRender(result);
        } catch (error) {
          const infographicError: InfographicError = createInfographicError(
            'runtime',
            `afterRender hook failed: ${formatErrorMessage(error)}`,
            undefined,
            error,
          );
          optionsRef.current.onError?.(infographicError);
          return;
        }
      }

      onRender?.(result);
      onLoad?.(result);
    },
    [],
  );

  return { handleRendered };
}
