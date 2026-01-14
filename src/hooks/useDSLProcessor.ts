import { useCallback, useRef } from 'react';
import { applyOverrides } from '../utils/dsl';
import { createInfographicError, formatErrorMessage } from '../utils/error';
import type {
  InfographicError,
  DSLObject,
  PreRenderHook,
  DSLOverride,
} from '../types';

interface DSLProcessorOptions {
  overrides?: DSLOverride[];
  beforeRender?: PreRenderHook;
  onError?: (error: InfographicError) => void;
}

export function useDSLProcessor(options: DSLProcessorOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const processDSL = useCallback(
    async (input: DSLObject): Promise<DSLObject> => {
      let processed: DSLObject = input;
      const { overrides, beforeRender } = optionsRef.current;

      if (overrides && overrides.length > 0) {
        try {
          processed = applyOverrides(processed, overrides);
        } catch (error) {
          const infographicError: InfographicError = createInfographicError(
            'syntax',
            `Failed to apply overrides: ${formatErrorMessage(error)}`,
            JSON.stringify(processed),
            error,
          );
          optionsRef.current.onError?.(infographicError);
          throw infographicError;
        }
      }

      if (beforeRender) {
        try {
          processed = await beforeRender(processed);
        } catch (error) {
          const infographicError: InfographicError = createInfographicError(
            'runtime',
            `beforeRender hook failed: ${formatErrorMessage(error)}`,
            JSON.stringify(processed),
            error,
          );
          optionsRef.current.onError?.(infographicError);
          throw infographicError;
        }
      }

      return processed;
    },
    [],
  );

  return { processDSL };
}
