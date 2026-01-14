import type { DSLOverride } from '../../types';

function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const isLast = i === keys.length - 1;

    if (isLast) {
      current[key] = value;
    } else {
      if (typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
  }
}

export function applyOverrides(base: string, overrides: DSLOverride[]): string {
  if (overrides.length === 0) return base;

  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(base);
  } catch (error) {
    throw new Error(`Failed to parse DSL: ${error instanceof Error ? error.message : String(error)}`);
  }

  for (const override of overrides) {
    setByPath(parsed, override.path, override.value);
  }

  return JSON.stringify(parsed);
}

export function mergeDSL(dsl1: string, dsl2: string): string {
  const obj1 = JSON.parse(dsl1);
  const obj2 = JSON.parse(dsl2);

  const merged = deepMerge(obj1, obj2);

  return JSON.stringify(merged);
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };

  for (const key in source) {
    if (source[key] === undefined) {
      continue;
    }

    const value = source[key];

    if (value === null) {
      result[key] = null;
      continue;
    }

    const targetValue = result[key];

    if (typeof value === 'object' && !Array.isArray(value) && targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
      result[key] = deepMerge(targetValue as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}
