import { useEffect } from 'react';
import { useRenderer } from './useRenderer';
import { useDSLProcessor } from './useDSLProcessor';
import { useRenderCallback } from './useRenderCallback';
import { useRenderController } from './useRenderController';
import { useRefMethods } from './useRefMethods';
import { createInfographicError, formatErrorMessage } from '../utils/error';
import type {
  InfographicProps,
  InfographicRef,
  InfographicError,
} from '../types';

export function useInfographic(
  containerRef: React.RefObject<HTMLElement>,
  props: InfographicProps,
) {
  const { render: rendererRender, update, toDataURL, getTypes, destroy, on, off } = useRenderer(containerRef);

  const { processDSL } = useDSLProcessor({
    overrides: props.overrides,
    beforeRender: props.beforeRender,
    onError: props.onError,
  });

  const { handleRendered } = useRenderCallback({
    afterRender: props.afterRender,
    onRender: props.onRender,
    onLoad: props.onLoad,
    onError: props.onError,
  });

  const { debouncedRender } = useRenderController(
    containerRef,
    rendererRender,
    props,
    processDSL,
    (error) => {
      const infographicError: InfographicError = createInfographicError(
        'render',
        formatErrorMessage(error),
        undefined,
        error,
      );
      props.onError?.(infographicError);
    },
  );

  const { refUpdate } = useRefMethods((options) => update(options), { processDSL, theme: props.theme });

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
    update: refUpdate,
    destroy,
  };

  return ref;
}
