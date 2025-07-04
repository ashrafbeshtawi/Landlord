import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const AUTH_USER = process.env.API_USER;
const AUTH_PASS = process.env.API_PASS;

// Helper: Basic Auth Verification
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) return false;

  const base64 = auth.split(' ')[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
  return user === AUTH_USER && pass === AUTH_PASS;
}

// GET /api/contact — List all contacts (requires auth)
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT * FROM public.contact ORDER BY created_at DESC');
    client.release();
    return NextResponse.json(res.rows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/contact — Create a new contact (no auth)
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const client = await pool.connect();
    await client.query(
      'INSERT INTO public.contact (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );
    client.release();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/contact?id=123 — Delete contact by ID (requires auth)
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing contact ID' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM public.contact WHERE id = $1', [id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
