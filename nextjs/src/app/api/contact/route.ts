import { NextRequest } from 'next/server';
import { Pool } from 'pg';
import { createSecureResponse, timingSafeCompare, sanitizeInput, parseJsonBody, getErrorMessage } from '@/utils/api';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const AUTH_USER = process.env.API_USER;
const AUTH_PASS = process.env.API_PASS;

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000; // Reduced from 5000 to prevent database bloat
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPostBody {
  name: string;
  email: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

/**
 * Timing-safe authorization check
 */
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) return false;

  // Check that we have valid auth credentials configured
  if (!AUTH_USER || !AUTH_PASS) {
    console.error('API authentication not configured');
    return false;
  }

  try {
    const base64 = auth.split(' ')[1];
    if (!base64) return false;

    const decoded = Buffer.from(base64, 'base64').toString();
    const colonIndex = decoded.indexOf(':');

    if (colonIndex === -1) return false;

    const user = decoded.substring(0, colonIndex);
    const pass = decoded.substring(colonIndex + 1);

    // Use timing-safe comparison to prevent timing attacks
    const userMatch = timingSafeCompare(user, AUTH_USER);
    const passMatch = timingSafeCompare(pass, AUTH_PASS);

    return userMatch && passMatch;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return createSecureResponse({ error: 'Unauthorized' }, 401);
  }

  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT * FROM public.contact ORDER BY created_at DESC');
    return createSecureResponse(res.rows);
  } catch (err: unknown) {
    console.error('Contact GET error:', getErrorMessage(err));
    return createSecureResponse({ error: 'Failed to fetch contacts.' }, 500);
  } finally {
    client?.release();
  }
}

export async function POST(req: NextRequest) {
  let client;
  try {
    const { data: body, error: parseError } = await parseJsonBody<ContactPostBody>(req);

    if (parseError || !body) {
      return createSecureResponse({ error: parseError || 'Invalid request body.' }, 400);
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return createSecureResponse({ error: 'All fields are required.' }, 400);
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return createSecureResponse({ error: 'Invalid field types.' }, 400);
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    if (sanitizedName.length === 0 || sanitizedName.length > MAX_NAME_LENGTH) {
      return createSecureResponse({ error: `Name must be between 1 and ${MAX_NAME_LENGTH} characters.` }, 400);
    }

    if (sanitizedMessage.length === 0 || sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
      return createSecureResponse({ error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` }, 400);
    }

    if (!isValidEmail(sanitizedEmail)) {
      return createSecureResponse({ error: 'Invalid email address.' }, 400);
    }

    client = await pool.connect();
    await client.query(
      'INSERT INTO public.contact (name, email, message) VALUES ($1, $2, $3)',
      [sanitizedName, sanitizedEmail, sanitizedMessage]
    );

    return createSecureResponse({ success: true });
  } catch (err: unknown) {
    console.error('Contact POST error:', getErrorMessage(err));
    return createSecureResponse({ error: 'Failed to submit contact form.' }, 500);
  } finally {
    client?.release();
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return createSecureResponse({ error: 'Unauthorized' }, 401);
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return createSecureResponse({ error: 'Missing contact ID.' }, 400);
  }

  const idNum = parseInt(id, 10);
  if (isNaN(idNum) || idNum <= 0) {
    return createSecureResponse({ error: 'Invalid contact ID.' }, 400);
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query('DELETE FROM public.contact WHERE id = $1', [idNum]);

    if (result.rowCount === 0) {
      return createSecureResponse({ error: 'Contact not found.' }, 404);
    }

    return createSecureResponse({ success: true });
  } catch (err: unknown) {
    console.error('Contact DELETE error:', getErrorMessage(err));
    return createSecureResponse({ error: 'Failed to delete contact.' }, 500);
  } finally {
    client?.release();
  }
}
