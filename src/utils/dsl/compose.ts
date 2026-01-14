import type { ComposeTemplateOptions, DSLObject } from '../../types';
import { applyOverrides } from './merge';

interface DSLNode {
  type?: string;
  data?: unknown;
  props?: Record<string, unknown>;
  children?: DSLNode[];
  [key: string]: unknown;
}

function isContainerNode(node: unknown): node is DSLNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    'children' in node &&
    Array.isArray((node as DSLNode).children)
  );
}

export function composeTemplates(options: ComposeTemplateOptions): DSLObject {
  const { templates, overrides = [] } = options;

  if (templates.length === 0) {
    throw new Error('At least one template is required');
  }

  if (templates.length === 1) {
    const base = templates[0];
    if (overrides.length > 0) {
      return applyOverrides(base, overrides);
    }
    return base;
  }

  const root = templates[0] as DSLNode;

  if (!isContainerNode(root)) {
    throw new Error('Root template must be a container node with children');
  }

  let currentChildren = root.children || [];

  for (let i = 1; i < templates.length; i++) {
    const template = templates[i] as DSLNode;

    if (isContainerNode(template) && template.children) {
      currentChildren = [...currentChildren, ...template.children];
    } else {
      currentChildren.push(template);
    }
  }

  root.children = currentChildren;

  let composed = root as DSLObject;

  if (overrides.length > 0) {
    composed = applyOverrides(composed, overrides);
  }

  return composed;
}
