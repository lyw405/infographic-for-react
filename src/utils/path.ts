export interface PathSegment {
  type: 'key' | 'index';
  value: string | number;
}

function parsePath(path: string): PathSegment[] {
  const segments: PathSegment[] = [];
  const regex = /([^.[\]]+)|\[(\d+)\]/g;
  let match;

  while ((match = regex.exec(path)) !== null) {
    if (match[1] !== undefined) {
      segments.push({ type: 'key', value: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: 'index', value: parseInt(match[2], 10) });
    }
  }

  return segments;
}

export function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const segments = parsePath(path);

  if (segments.length === 0) {
    throw new Error(`Invalid path: ${path}`);
  }

  let current: unknown = obj;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const isLast = i === segments.length - 1;

    if (typeof current !== 'object' || current === null) {
      throw new Error(`Cannot set property at path "${path}": cannot navigate through non-object`);
    }

    if (segment.type === 'key') {
      const currentObj = current as Record<string, unknown>;
      if (isLast) {
        currentObj[segment.value] = value;
      } else {
        const nextValue = currentObj[segment.value];
        if (nextValue !== undefined && (typeof nextValue !== 'object' || nextValue === null)) {
          throw new Error(`Cannot set property at path "${path}": cannot navigate through non-object`);
        }
        if (typeof nextValue !== 'object' || nextValue === null) {
          currentObj[segment.value] = {};
        }
        current = currentObj[segment.value];
      }
    } else {
      const currentArray = current as unknown[];
      if (!Array.isArray(currentArray)) {
        throw new Error(`Cannot access array index at path "${path}": parent is not an array`);
      }
      const index = segment.value as number;
      if (isLast) {
        currentArray[index] = value;
      } else {
        const nextValue = currentArray[index];
        if (nextValue !== undefined && (typeof nextValue !== 'object' || nextValue === null)) {
          throw new Error(`Cannot set property at path "${path}": cannot navigate through non-object`);
        }
        if (typeof nextValue !== 'object' || nextValue === null) {
          currentArray[index] = {};
        }
        current = currentArray[index];
      }
    }
  }
}

export function getByPath(obj: Record<string, unknown>, path: string): unknown {
  const segments = parsePath(path);

  if (segments.length === 0) {
    return undefined;
  }

  let current: unknown = obj;

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    if (segment.type === 'key') {
      current = (current as Record<string, unknown>)[segment.value];
    } else {
      if (!Array.isArray(current)) {
        return undefined;
      }
      const index = segment.value as number;
      current = current[index];
    }
  }

  return current;
}
