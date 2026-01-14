import React, { useRef, useCallback } from 'react';
import { Infographic, useInfographic } from '@antv/infographic-react';

const dsl = JSON.stringify({
  design: {
    title: {
      component: 'Title',
      props: {
        text: 'Hooks Example',
      },
    },
    items: [
      {
        name: 'SimpleItem',
        component: 'SimpleItem',
        props: {
          label: 'Data Item',
          value: 100,
        },
      },
    ],
    structure: {
      component: 'Flex',
      props: {
        direction: 'column',
      },
    },
  },
  data: {},
});

export function HooksExample() {
  const ref = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const infographic = useInfographic(containerRef, {
    dsl,
    onRender: (result) => {
      console.log('Infographic rendered:', result);
    },
  });

  const handleExport = useCallback(async () => {
    if (!infographic) return;

    try {
      const dataURL = await infographic.toDataURL({ type: 'svg' });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'infographic.svg';
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [infographic]);

  const handleGetTypes = useCallback(() => {
    if (!infographic) return;

    try {
      const types = infographic.getTypes();
      console.log('Infographic types:', types);
      alert(`Types: ${types?.join(', ')}`);
    } catch (error) {
      console.error('Get types failed:', error);
    }
  }, [infographic]);

  const handleUpdate = useCallback(() => {
    if (!infographic) return;

    const updatedDSL = JSON.stringify({
      ...JSON.parse(dsl),
      design: {
        ...JSON.parse(dsl).design,
        title: {
          ...JSON.parse(dsl).design.title,
          props: {
            text: 'Updated via Hook',
          },
        },
      },
    });

    infographic.update(updatedDSL);
  }, [infographic]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>useInfographic Hook Example</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={handleExport}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Export SVG
        </button>
        <button
          type="button"
          onClick={handleGetTypes}
          style={{
            padding: '8px 16px',
            backgroundColor: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Get Types
        </button>
        <button
          type="button"
          onClick={handleUpdate}
          style={{
            padding: '8px 16px',
            backgroundColor: '#fa8c16',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Update DSL
        </button>
      </div>

      <div ref={containerRef} style={{ width: '600px', height: '400px' }} />
    </div>
  );
}
