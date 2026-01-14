import { describe, it, expect } from 'vitest';
import { setByPath, getByPath } from '../../src/utils/path';

describe('path utilities', () => {
  describe('setByPath', () => {
    it('should set value by simple key path', () => {
      const obj: Record<string, unknown> = {};
      setByPath(obj, 'name', 'test');
      expect(obj.name).toBe('test');
    });

    it('should set value by nested key path', () => {
      const obj: Record<string, unknown> = { data: {} };
      setByPath(obj, 'data.value', 123);
      expect((obj.data as Record<string, unknown>).value).toBe(123);
    });

    it('should create nested objects if they do not exist', () => {
      const obj: Record<string, unknown> = {};
      setByPath(obj, 'data.nested.value', 'deep');
      expect(obj).toEqual({ data: { nested: { value: 'deep' } } });
    });

    it('should set value by array index path', () => {
      const obj: Record<string, unknown> = { items: [] };
      setByPath(obj, 'items[0]', 'first');
      expect(obj.items).toEqual(['first']);
    });

    it('should set value by mixed path with keys and indices', () => {
      const obj: Record<string, unknown> = { data: { items: [] } };
      setByPath(obj, 'data.items[0].name', 'test');
      expect((obj.data as Record<string, unknown>).items).toEqual([{ name: 'test' }]);
    });

    it('should throw error for empty path', () => {
      const obj: Record<string, unknown> = {};
      expect(() => setByPath(obj, '', 'value')).toThrow('Invalid path');
    });

    it('should throw error when navigating through non-object', () => {
      const obj: Record<string, unknown> = { data: 'string' };
      expect(() => setByPath(obj, 'data.value', 'test')).toThrow('cannot navigate through non-object');
    });

    it('should throw error when array index used on non-array', () => {
      const obj: Record<string, unknown> = { data: {} };
      expect(() => setByPath(obj, 'data[0]', 'test')).toThrow('parent is not an array');
    });
  });

  describe('getByPath', () => {
    it('should get value by simple key path', () => {
      const obj: Record<string, unknown> = { name: 'test' };
      expect(getByPath(obj, 'name')).toBe('test');
    });

    it('should get value by nested key path', () => {
      const obj: Record<string, unknown> = { data: { value: 123 } };
      expect(getByPath(obj, 'data.value')).toBe(123);
    });

    it('should get value by array index path', () => {
      const obj: Record<string, unknown> = { items: ['first', 'second'] };
      expect(getByPath(obj, 'items[1]')).toBe('second');
    });

    it('should return undefined for non-existent path', () => {
      const obj: Record<string, unknown> = { data: {} };
      expect(getByPath(obj, 'data.nonexistent')).toBeUndefined();
    });

    it('should return undefined for empty path', () => {
      const obj: Record<string, unknown> = { name: 'test' };
      expect(getByPath(obj, '')).toBeUndefined();
    });

    it('should return undefined when navigating through null', () => {
      const obj: Record<string, unknown> = { data: null };
      expect(getByPath(obj, 'data.value')).toBeUndefined();
    });

    it('should return undefined when navigating through undefined', () => {
      const obj: Record<string, unknown> = { data: {} };
      expect(getByPath(obj, 'data.nonexistent.value')).toBeUndefined();
    });
  });
});
