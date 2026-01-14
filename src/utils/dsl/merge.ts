import type { DSLOverride, DSLObject } from '../../types';
import { setByPath } from '../path';

export function applyOverrides(base: DSLObject, overrides: DSLOverride[]): DSLObject {
  if (overrides.length === 0) return base;

  const result = { ...base };

  for (const override of overrides) {
    setByPath(result as Record<string, unknown>, override.path, override.value);
  }

  return result;
}

export function mergeDSL(dsl1: DSLObject, dsl2: DSLObject): DSLObject {
  const merged = deepMerge(dsl1 as unknown as Record<string, unknown>, dsl2 as unknown as Record<string, unknown>);
  return merged as unknown as DSLObject;
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
