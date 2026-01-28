import crypto from 'crypto';

export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

export function validateTicker(ticker: string): boolean {
  // Basic validation: 1-5 uppercase letters
  return /^[A-Z]{1,5}$/.test(ticker);
}

export function validateNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value) && value > 0;
}
