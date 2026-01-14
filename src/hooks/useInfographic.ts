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
  DSLObject,
  ThemeConfig,
  InfographicOptions,
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
    async (input: DSLInput | undefined): Promise<DSLObject> => {
      if (!input) {
        throw new Error('DSL is required');
      }
      return input;
    },
    [],
  );

  const processDSL = useCallback(
    async (input: DSLObject): Promise<DSLObject> => {
      let processed: DSLObject = input;
      const { overrides, beforeRender } = propsRef.current;

      if (overrides && overrides.length > 0) {
        try {
          processed = applyOverrides(processed, overrides);
        } catch (error) {
          const infographicError: InfographicError = {
            type: 'syntax',
            message: `Failed to apply overrides: ${error instanceof Error ? error.message : String(error)}`,
            dsl: JSON.stringify(processed),
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
            dsl: JSON.stringify(processed),
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
      width,
      height,
      theme,
      editable,
      className,
    } = propsRef.current;

    try {
      let processedDSL: DSLObject;

      if (!dsl) {
        throw new Error('DSL prop is required');
      }

      processedDSL = await resolveDSL(dsl);
      processedDSL = await processDSL(processedDSL);

      const dslString = JSON.stringify(processedDSL);
      if (dslCacheRef.current !== dslString) {
        dslCacheRef.current = dslString;

        const renderOptions: Partial<InfographicOptions> = { ...processedDSL };

        if (processedDSL.theme) renderOptions.theme = processedDSL.theme;
        else if (theme) renderOptions.theme = theme;

        if (processedDSL.palette) {
          const existingThemeConfig = (processedDSL.themeConfig || {}) as ThemeConfig;
          renderOptions.themeConfig = {
            ...existingThemeConfig,
            palette: processedDSL.palette,
          };
        }

        if (editable !== undefined) renderOptions.editable = editable;

        delete (renderOptions as any).palette;

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

  const refUpdate = useCallback(
    async (options: DSLInput) => {
      const processed = await processDSL(options);
      const themeConfig = (processed.themeConfig || {}) as ThemeConfig;
      if (processed.palette) {
        themeConfig.palette = processed.palette;
      }

      const { palette: _, ...rest } = processed as any;
      const renderOptions: Partial<InfographicOptions> = {
        ...rest,
        theme: processed.theme ?? propsRef.current.theme,
        themeConfig,
      };
      update(renderOptions);
    },
    [update, processDSL],
  );

  const ref: InfographicRef = {
    toDataURL,
    getTypes,
    update: refUpdate,
    destroy,
  };

  return ref;
}
