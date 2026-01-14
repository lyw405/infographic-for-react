import type { InfographicError } from '../types';

export function createInfographicError(
  type: InfographicError['type'],
  message: string,
  dsl?: string,
  details?: Error | unknown,
): InfographicError {
  return {
    type,
    message,
    dsl,
    details,
  };
}

export function isInfographicError(error: unknown): error is InfographicError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    ['syntax', 'render', 'runtime'].includes((error as InfographicError).type)
  );
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
