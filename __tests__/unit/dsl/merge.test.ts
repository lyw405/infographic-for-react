import { describe, it, expect } from 'vitest';
import { applyOverrides, mergeDSL } from '../../../src/utils/dsl';

describe('applyOverrides', () => {
  it('should apply a single override', () => {
    const dsl = { foo: 'bar' };
    const overrides = [{ path: 'foo', value: 'baz' }];

    const result = applyOverrides(dsl, overrides);
    expect(result).toEqual({ foo: 'baz' });
  });

  it('should apply nested overrides', () => {
    const dsl = { data: { value: 10 } };
    const overrides = [{ path: 'data.value', value: 20 }];

    const result = applyOverrides(dsl, overrides);
    expect(result).toEqual({ data: { value: 20 } });
  });

  it('should apply multiple overrides', () => {
    const dsl = { foo: 'bar', nested: { a: 1, b: 2 } };
    const overrides = [
      { path: 'foo', value: 'baz' },
      { path: 'nested.b', value: 3 },
    ];

    const result = applyOverrides(dsl, overrides);
    expect(result).toEqual({
      foo: 'baz',
      nested: { a: 1, b: 3 },
    });
  });

  it('should handle empty overrides', () => {
    const dsl = { foo: 'bar' };
    const result = applyOverrides(dsl, []);
    expect(result).toBe(dsl);
  });

  it('should handle null values', () => {
    const dsl = { foo: 'bar', baz: null };
    const overrides = [{ path: 'foo', value: null }];

    const result = applyOverrides(dsl, overrides);
    expect(result).toEqual({ foo: null, baz: null });
  });
});

describe('mergeDSL', () => {
  it('should merge two simple DSL objects', () => {
    const dsl1 = { foo: 'bar' };
    const dsl2 = { baz: 'qux' };

    const result = mergeDSL(dsl1, dsl2);
    expect(result).toEqual({ foo: 'bar', baz: 'qux' });
  });

  it('should override values in base with values from override', () => {
    const dsl1 = { foo: 'bar', baz: 'qux' };
    const dsl2 = { foo: 'new' };

    const result = mergeDSL(dsl1, dsl2);
    expect(result).toEqual({ foo: 'new', baz: 'qux' });
  });

  it('should deeply merge nested objects', () => {
    const dsl1 = {
      data: { a: 1, b: 2 },
      other: 'value',
    };
    const dsl2 = {
      data: { b: 3, c: 4 },
    };

    const result = mergeDSL(dsl1, dsl2);
    expect(result).toEqual({
      data: { a: 1, b: 3, c: 4 },
      other: 'value',
    });
  });

  it('should handle arrays as direct values', () => {
    const dsl1 = { items: [1, 2, 3] };
    const dsl2 = { items: [4, 5] };

    const result = mergeDSL(dsl1, dsl2);
    expect(result).toEqual({ items: [4, 5] });
  });

  it('should preserve non-merged fields', () => {
    const dsl1 = {
      foo: 'bar',
      baz: 'qux',
      other: { a: 1 },
    };
    const dsl2 = { foo: 'new' };

    const result = mergeDSL(dsl1, dsl2);
    expect(result).toEqual({
      foo: 'new',
      baz: 'qux',
      other: { a: 1 },
    });
  });
});
