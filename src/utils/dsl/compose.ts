import type { ComposeTemplateOptions } from '../../types';
import { applyOverrides } from './merge';

interface DSLNode {
  type?: string;
  data?: unknown;
  props?: Record<string, unknown>;
  children?: DSLNode[];
  [key: string]: unknown;
}

function parseDSL(dsl: string): DSLNode {
  try {
    return JSON.parse(dsl);
  } catch (error) {
    throw new Error(`Failed to parse DSL: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function stringifyDSL(node: DSLNode): string {
  return JSON.stringify(node);
}

function isContainerNode(node: DSLNode): boolean {
  return (
    typeof node === 'object' &&
    node !== null &&
    'children' in node &&
    Array.isArray(node.children)
  );
}

export function composeTemplates(options: ComposeTemplateOptions): string {
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

  const parsedTemplates = templates.map(parseDSL);

  const root = parsedTemplates[0];

  if (!isContainerNode(root)) {
    throw new Error('Root template must be a container node with children');
  }

  let currentChildren = root.children || [];

  for (let i = 1; i < parsedTemplates.length; i++) {
    const template = parsedTemplates[i];

    if (isContainerNode(template) && template.children) {
      currentChildren = [...currentChildren, ...template.children];
    } else {
      currentChildren.push(template);
    }
  }

  root.children = currentChildren;

  let composed = stringifyDSL(root);

  if (overrides.length > 0) {
    composed = applyOverrides(composed, overrides);
  }

  return composed;
}
