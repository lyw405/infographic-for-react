import React from 'react';
import { Infographic } from '@antv/infographic-react';

const dsl = JSON.stringify({
  design: {
    title: {
      component: 'Title',
      props: {
        text: 'Quick Start Example',
      },
    },
    items: [
      {
        name: 'ProgressCard',
        component: 'ProgressCard',
        props: {
          label: 'Progress',
          value: 75,
          color: '#1890ff',
        },
      },
    ],
    structure: {
      component: 'Flex',
      props: {
        direction: 'column',
        gap: 20,
      },
    },
  },
  data: {},
});

export function BasicExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Basic Infographic</h2>
      <Infographic dsl={dsl} width={600} height={400} />
    </div>
  );
}
