import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

// Maximum request body size (100KB)
export const MAX_REQUEST_BODY_SIZE = 100 * 1024;

/**
 * Creates a secure response with appropriate security headers
 */
export function createSecureResponse(data: object, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status });
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  // Pad to same length to prevent length-based timing attacks
  const maxLength = Math.max(a.length, b.length);
  const paddedA = a.padEnd(maxLength, '\0');
  const paddedB = b.padEnd(maxLength, '\0');

  try {
    return timingSafeEqual(Buffer.from(paddedA), Buffer.from(paddedB));
  } catch {
    return false;
  }
}

/**
 * Validates Content-Type header is application/json
 */
export function validateContentType(request: Request): boolean {
  const contentType = request.headers.get('content-type');
  return contentType?.toLowerCase().includes('application/json') ?? false;
}

/**
 * Safely parses JSON body with size limit
 */
export async function parseJsonBody<T>(request: Request): Promise<{ data: T | null; error: string | null }> {
  // Check Content-Type
  if (!validateContentType(request)) {
    return { data: null, error: 'Content-Type must be application/json' };
  }

  // Check Content-Length if available
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_SIZE) {
    return { data: null, error: 'Request body too large' };
  }

  try {
    const text = await request.text();

    // Check actual body size
    if (text.length > MAX_REQUEST_BODY_SIZE) {
      return { data: null, error: 'Request body too large' };
    }

    const data = JSON.parse(text) as T;
    return { data, error: null };
  } catch {
    return { data: null, error: 'Invalid JSON body' };
  }
}

/**
 * Masks sensitive data like wallet addresses for logging
 */
export function maskAddress(address: string): string {
  if (!address || address.length < 10) return '***';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Sanitizes string input - removes potentially dangerous characters
 * More comprehensive than just < and >
 */
export function sanitizeInput(str: string): string {
  return str
    .trim()
    // Remove HTML tags and dangerous characters
    .replace(/[<>]/g, '')
    // Remove potential script injection characters
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ');
}

/**
 * Type guard for Error objects
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Safely extracts error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
