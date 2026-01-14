import { useCallback, useRef } from 'react';
import { debounce } from 'lodash-es';
import { RENDER_DEBOUNCE_DELAY } from '../constants';
import type {
  DSLInput,
  DSLObject,
  InfographicOptions,
  ThemeConfig,
} from '../types';

interface RenderControllerProps {
  dsl?: DSLInput;
  width?: number | string;
  height?: number | string;
  theme?: string;
  editable?: boolean;
  className?: string;
}

export function useRenderController(
  containerRef: React.RefObject<HTMLElement>,
  rendererRender: (options: string | Partial<InfographicOptions>) => void,
  props: RenderControllerProps,
  processDSL: (input: DSLObject) => Promise<DSLObject>,
  onError?: (error: unknown) => void,
) {
  const propsRef = useRef(props);
  const dslCacheRef = useRef<string | null>(null);
  const stringDslCacheRef = useRef<string | null>(null);

  propsRef.current = props;

  const render = useCallback(async () => {
    const { dsl, width, height, theme, editable, className } = propsRef.current;

    if (!dsl) {
      throw new Error('DSL prop is required');
    }

    if (containerRef.current && className) {
      containerRef.current.className = className;
    }

    if (typeof dsl === 'string') {
      const trimmedDsl = dsl.trim();
      if (!trimmedDsl) {
        throw new Error('String DSL cannot be empty or contain only whitespace');
      }
      if (stringDslCacheRef.current !== trimmedDsl) {
        stringDslCacheRef.current = trimmedDsl;
        rendererRender(trimmedDsl);
      }
    } else {
      const processedDSL: DSLObject = await processDSL(dsl);

      const dslString = JSON.stringify(processedDSL);
      if (dslCacheRef.current !== dslString) {
        dslCacheRef.current = dslString;

        const { palette, ...restDSL } = processedDSL;

        const renderOptions: Partial<InfographicOptions> = {
          ...restDSL,
          data: processedDSL.data,
          width,
          height,
          editable,
        };

        if (processedDSL.theme) {
          renderOptions.theme = processedDSL.theme;
        } else if (theme) {
          renderOptions.theme = theme;
        }

        if (palette) {
          const existingThemeConfig = (processedDSL.themeConfig || {}) as ThemeConfig;
          renderOptions.themeConfig = {
            ...existingThemeConfig,
            palette,
          };
        }

        rendererRender(renderOptions);
      }
    }
  }, [containerRef, rendererRender, processDSL]);

  const debouncedRender = useCallback(
    debounce(() => {
      render().catch((error) => {
        onError?.(error);
      });
    }, RENDER_DEBOUNCE_DELAY),
    [render, onError],
  );

  return { debouncedRender };
}
