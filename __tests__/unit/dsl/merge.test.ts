import { describe, it, expect } from 'vitest';
import { applyOverrides, mergeDSL } from '../../../src/utils/dsl';

describe('applyOverrides', () => {
  it('should apply a single override', () => {
    const dsl = JSON.stringify({ foo: 'bar' });
    const overrides = [{ path: 'foo', value: 'baz' }];

    const result = applyOverrides(dsl, overrides);
    expect(JSON.parse(result)).toEqual({ foo: 'baz' });
  });

  it('should apply nested overrides', () => {
    const dsl = JSON.stringify({ data: { value: 10 } });
    const overrides = [{ path: 'data.value', value: 20 }];

    const result = applyOverrides(dsl, overrides);
    expect(JSON.parse(result)).toEqual({ data: { value: 20 } });
  });

  it('should apply multiple overrides', () => {
    const dsl = JSON.stringify({ foo: 'bar', nested: { a: 1, b: 2 } });
    const overrides = [
      { path: 'foo', value: 'baz' },
      { path: 'nested.b', value: 3 },
    ];

    const result = applyOverrides(dsl, overrides);
    expect(JSON.parse(result)).toEqual({
      foo: 'baz',
      nested: { a: 1, b: 3 },
    });
  });

  it('should handle empty overrides', () => {
    const dsl = JSON.stringify({ foo: 'bar' });
    const result = applyOverrides(dsl, []);
    expect(result).toBe(dsl);
  });

  it('should handle null values', () => {
    const dsl = JSON.stringify({ foo: 'bar', baz: null });
    const overrides = [{ path: 'foo', value: null }];

    const result = applyOverrides(dsl, overrides);
    expect(JSON.parse(result)).toEqual({ foo: null, baz: null });
  });

  it('should throw on invalid JSON', () => {
    const dsl = 'invalid json';
    const overrides = [{ path: 'foo', value: 'bar' }];

    expect(() => applyOverrides(dsl, overrides)).toThrow('Failed to parse DSL');
  });
});

describe('mergeDSL', () => {
  it('should merge two simple DSL strings', () => {
    const dsl1 = JSON.stringify({ foo: 'bar' });
    const dsl2 = JSON.stringify({ baz: 'qux' });

    const result = mergeDSL(dsl1, dsl2);
    expect(JSON.parse(result)).toEqual({ foo: 'bar', baz: 'qux' });
  });

  it('should override values in base with values from override', () => {
    const dsl1 = JSON.stringify({ foo: 'bar', baz: 'qux' });
    const dsl2 = JSON.stringify({ foo: 'new' });

    const result = mergeDSL(dsl1, dsl2);
    expect(JSON.parse(result)).toEqual({ foo: 'new', baz: 'qux' });
  });

  it('should deeply merge nested objects', () => {
    const dsl1 = JSON.stringify({
      data: { a: 1, b: 2 },
      other: 'value',
    });
    const dsl2 = JSON.stringify({
      data: { b: 3, c: 4 },
    });

    const result = mergeDSL(dsl1, dsl2);
    expect(JSON.parse(result)).toEqual({
      data: { a: 1, b: 3, c: 4 },
      other: 'value',
    });
  });

  it('should handle arrays as direct values', () => {
    const dsl1 = JSON.stringify({ items: [1, 2, 3] });
    const dsl2 = JSON.stringify({ items: [4, 5] });

    const result = mergeDSL(dsl1, dsl2);
    expect(JSON.parse(result)).toEqual({ items: [4, 5] });
  });

  it('should preserve non-merged fields', () => {
    const dsl1 = JSON.stringify({
      foo: 'bar',
      baz: 'qux',
      other: { a: 1 },
    });
    const dsl2 = JSON.stringify({ foo: 'new' });

    const result = mergeDSL(dsl1, dsl2);
    expect(JSON.parse(result)).toEqual({
      foo: 'new',
      baz: 'qux',
      other: { a: 1 },
    });
  });
});
