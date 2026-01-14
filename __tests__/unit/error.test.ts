import { describe, it, expect } from 'vitest';
import { createInfographicError, isInfographicError, formatErrorMessage } from '../../src/utils/error';

describe('error utilities', () => {
  describe('createInfographicError', () => {
    it('should create a syntax error', () => {
      const error = createInfographicError('syntax', 'Invalid DSL', '{"test":1}', new Error('Parse error'));
      expect(error.type).toBe('syntax');
      expect(error.message).toBe('Invalid DSL');
      expect(error.dsl).toBe('{"test":1}');
      expect(error.details).toBeInstanceOf(Error);
    });

    it('should create a render error', () => {
      const error = createInfographicError('render', 'Render failed');
      expect(error.type).toBe('render');
      expect(error.message).toBe('Render failed');
      expect(error.dsl).toBeUndefined();
      expect(error.details).toBeUndefined();
    });

    it('should create a runtime error', () => {
      const error = createInfographicError('runtime', 'Hook error', undefined, { info: 'details' });
      expect(error.type).toBe('runtime');
      expect(error.message).toBe('Hook error');
      expect(error.details).toEqual({ info: 'details' });
    });
  });

  describe('isInfographicError', () => {
    it('should return true for valid InfographicError', () => {
      const error = createInfographicError('syntax', 'Test');
      expect(isInfographicError(error)).toBe(true);
    });

    it('should return false for plain object', () => {
      const obj = { type: 'other', message: 'test' };
      expect(isInfographicError(obj)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isInfographicError(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isInfographicError(undefined)).toBe(false);
    });

    it('should return false for Error instance', () => {
      const error = new Error('test');
      expect(isInfographicError(error)).toBe(false);
    });

    it('should return false for object with invalid type', () => {
      const obj = { type: 'invalid', message: 'test' };
      expect(isInfographicError(obj)).toBe(false);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format Error instance message', () => {
      const error = new Error('Test error');
      expect(formatErrorMessage(error)).toBe('Test error');
    });

    it('should format string', () => {
      expect(formatErrorMessage('string error')).toBe('string error');
    });

    it('should format number', () => {
      expect(formatErrorMessage(123)).toBe('123');
    });

    it('should format object', () => {
      expect(formatErrorMessage({ key: 'value' })).toBe('[object Object]');
    });

    it('should format null', () => {
      expect(formatErrorMessage(null)).toBe('null');
    });

    it('should format undefined', () => {
      expect(formatErrorMessage(undefined)).toBe('undefined');
    });
  });
});
