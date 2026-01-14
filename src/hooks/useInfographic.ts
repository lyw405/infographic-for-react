import { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash-es';
import { useRenderer } from './useRenderer';
import { applyOverrides } from '../utils/dsl';
import type {
  InfographicProps,
  InfographicRef,
  InfographicError,
  InfographicRenderResult,
  DSLInput,
} from '../types';

export function useInfographic(
  containerRef: React.RefObject<HTMLElement>,
  props: InfographicProps,
) {
  const { render: rendererRender, update, toDataURL, getTypes, destroy, on, off } = useRenderer(containerRef);

  const propsRef = useRef(props);
  const dslCacheRef = useRef<string | null>(null);

  propsRef.current = props;

  const resolveDSL = useCallback(
    async (input: DSLInput | undefined): Promise<string> => {
      if (!input) {
        throw new Error('DSL or template is required');
      }

      if (typeof input === 'string') {
        if (input.trim().startsWith('{') || input.trim().startsWith('[')) {
          return input;
        }
        return input;
      }

      if (input.type === 'dsl') {
        return input.value;
      }

      if (input.type === 'template') {
        return input.value;
      }

      throw new Error('Invalid DSL input type');
    },
    [],
  );

  const processDSL = useCallback(
    async (input: string): Promise<string> => {
      let processed = input;
      const { overrides, beforeRender } = propsRef.current;

      if (overrides && overrides.length > 0) {
        try {
          processed = applyOverrides(processed, overrides);
        } catch (error) {
          const infographicError: InfographicError = {
            type: 'syntax',
            message: `Failed to apply overrides: ${error instanceof Error ? error.message : String(error)}`,
            dsl: processed,
            details: error,
          };
          propsRef.current.onError?.(infographicError);
          throw infographicError;
        }
      }

      if (beforeRender) {
        try {
          processed = await beforeRender(processed);
        } catch (error) {
          const infographicError: InfographicError = {
            type: 'runtime',
            message: `beforeRender hook failed: ${error instanceof Error ? error.message : String(error)}`,
            dsl: processed,
            details: error,
          };
          propsRef.current.onError?.(infographicError);
          throw infographicError;
        }
      }

      return processed;
    },
    [],
  );

  const handleRendered = useCallback(
    async (result: InfographicRenderResult) => {
      const { afterRender, onRender } = propsRef.current;

      if (afterRender) {
        try {
          await afterRender(result);
        } catch (error) {
          const infographicError: InfographicError = {
            type: 'runtime',
            message: `afterRender hook failed: ${error instanceof Error ? error.message : String(error)}`,
            dsl: JSON.stringify(result.options),
            details: error,
          };
          propsRef.current.onError?.(infographicError);
          return;
        }
      }

      onRender?.(result);
    },
    [],
  );

  const render = useCallback(async () => {
    const {
      dsl,
      template,
      width,
      height,
      theme,
      palette,
      editable,
      className,
    } = propsRef.current;

    const input = dsl || template;

    try {
      let processedDSL: string;

      if (!input) {
        throw new Error('Either dsl or template prop is required');
      }

      processedDSL = await resolveDSL(input);
      processedDSL = await processDSL(processedDSL);

      if (dslCacheRef.current !== processedDSL) {
        dslCacheRef.current = processedDSL;

        const renderOptions: Record<string, unknown> = { ...JSON.parse(processedDSL) };

        if (theme) renderOptions.theme = theme;
        if (palette) renderOptions.palette = palette;
        if (editable !== undefined) renderOptions.editable = editable;

        if (width || height) {
          renderOptions.width = width;
          renderOptions.height = height;
        }

        if (containerRef.current && className) {
          containerRef.current.className = className;
        }

        rendererRender(renderOptions);
      }
    } catch (error) {
      const infographicError: InfographicError = {
        type: 'runtime',
        message: error instanceof Error ? error.message : String(error),
        details: error,
      };
      propsRef.current.onError?.(infographicError);
    }
  }, [containerRef, rendererRender, resolveDSL, processDSL]);

  const debouncedRender = useCallback(
    debounce(() => {
      render().catch((error) => {
        console.error('[Infographic-for-React] Render error:', error);
      });
    }, 100),
    [render],
  );

  useEffect(() => {
    on('rendered', handleRendered);
    on('loaded', handleRendered);

    return () => {
      off('rendered', handleRendered);
      off('loaded', handleRendered);
    };
  }, [on, off, handleRendered]);

  useEffect(() => {
    debouncedRender();
    return debouncedRender.cancel;
  }, [debouncedRender]);

  const ref: InfographicRef = {
    toDataURL,
    getTypes,
    update,
    destroy,
  };

  return ref;
}
