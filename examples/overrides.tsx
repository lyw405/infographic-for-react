import React from 'react';
import { Infographic } from '@antv/infographic-react';

const dsl = JSON.stringify({
  design: {
    title: {
      component: 'Title',
      props: {
        text: 'Original Title',
      },
    },
    items: [
      {
        name: 'SimpleItem',
        component: 'SimpleItem',
        props: {
          label: 'Item 1',
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

export function OverridesExample() {
  const overrides = [
    { path: 'design.title.props.text', value: 'Overridden Title' },
    { path: 'design.items[0].props.value', value: 200 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>DSL Overrides Example</h2>
      <Infographic dsl={dsl} overrides={overrides} width={600} height={400} />
    </div>
  );
}
