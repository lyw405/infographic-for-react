import { useCallback, useRef } from 'react';
import type { DSLInput, DSLObject, InfographicOptions, Palette, ThemeConfig } from '../types';

interface RefMethodsProps {
  processDSL: (input: DSLObject) => Promise<DSLObject>;
  theme?: string;
}

export function useRefMethods(
  update: (options: string | Partial<InfographicOptions>) => void,
  { processDSL, theme }: RefMethodsProps,
) {
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const refUpdate = useCallback(
    async (options: DSLInput) => {
      if (typeof options === 'string') {
        update(options);
        return;
      }

      const processed: DSLObject = await processDSL(options);
      const { palette, ...restProcessed } = processed;
      const themeConfig = (processed.themeConfig || {}) as ThemeConfig;

      if (palette) {
        themeConfig.palette = palette as Palette;
      }

      const renderOptions: Partial<InfographicOptions> = {
        ...restProcessed,
        theme: processed.theme ?? themeRef.current,
        themeConfig,
      };

      update(renderOptions);
    },
    [update, processDSL],
  );

  return { refUpdate };
}
