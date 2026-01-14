import React from 'react';
import { Infographic } from '@antv/infographic-react';

export function TemplateExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Template Example</h2>
      <Infographic template="list-zigzag" width={800} height={600} />
    </div>
  );
}
