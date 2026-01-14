import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useInfographic } from '../hooks';
import type { InfographicProps, InfographicRef, InfographicError } from '../types';

const defaultError = {
  type: 'render' as const,
  message: 'An error occurred while rendering the infographic.',
};

function InfographicComponent(
  props: InfographicProps,
  ref: React.Ref<InfographicRef>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<InfographicError | null>(null);
  const [errorKey, setErrorKey] = useState(0);

  const infographicRef = useInfographic(containerRef, {
    ...props,
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

  const isDev = typeof import.meta.env.DEV !== 'undefined' && import.meta.env.DEV === true;

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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            color: '#d32f2f',
            padding: '20px',
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px' }}>
            Infographic Render Error
          </div>
          <div style={{ marginBottom: '15px' }}>
            {error.message || defaultError.message}
          </div>
          <button
            type="button"
            onClick={handleRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Retry
          </button>
          {isDev && error.details ? (
            <details style={{ marginTop: '15px', textAlign: 'left', maxWidth: '80%' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details
              </summary>
              <pre
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                }}
              >
                {String(error.details)}
              </pre>
            </details>
          ) : null}
        </div>
      )}
    </>
  );
}

export const Infographic = forwardRef(InfographicComponent);
