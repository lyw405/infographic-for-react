import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useInfographic } from '../hooks';
import type { InfographicProps, InfographicRef, InfographicError } from '../types';
import {
  errorOverlayStyles,
  errorTitleStyles,
  errorMessageStyles,
  retryButtonStyles,
} from './styles';

const defaultError: InfographicError = {
  type: 'render',
  message: 'An error occurred while rendering the infographic.',
};

function InfographicComponent(
  props: InfographicProps,
  ref: React.Ref<InfographicRef>,
) {
  const { children, dsl: dslProp, ...restProps } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<InfographicError | null>(null);
  const [errorKey, setErrorKey] = useState(0);
  const childrenDsl = children ? String(children).trim() : undefined;
  const finalDsl = childrenDsl || dslProp;

  if (!finalDsl) {
    throw new Error('Either children or dsl prop must be provided');
  }

  const infographicRef = useInfographic(containerRef, {
    ...restProps,
    dsl: finalDsl,
    onError: (err) => {
      setError(err);
      props.onError?.(err);
    },
  });

  useImperativeHandle(ref, () => infographicRef, [infographicRef]);

  const handleRetry = () => {
    setError(null);
    setErrorKey((prev) => prev + 1);
  };

  const containerStyle: React.CSSProperties = {
    width: props.width ?? '100%',
    height: props.height ?? 'auto',
    overflow: 'hidden',
  };

  return (
    <>
      <div
        key={`infographic-container-${errorKey}`}
        ref={containerRef}
        className={props.className}
        style={containerStyle}
        data-infographic-container
      />
      {error && (
        <div style={errorOverlayStyles}>
          <div style={errorTitleStyles}>Infographic Render Error</div>
          <div style={errorMessageStyles}>{error.message || defaultError.message}</div>
          <button type="button" onClick={handleRetry} style={retryButtonStyles}>
            Retry
          </button>
        </div>
      )}
    </>
  );
}

export const Infographic = forwardRef(InfographicComponent);
