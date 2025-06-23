import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const allowedOrigins = ['https://baumbie.org', 'http://localhost:5173'];

serve(async (req) => {
  const origin = req.headers.get('origin')

  // Globale Origin-Check – sofort blockieren, wenn nicht erlaubt
  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    })
  }

  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    return new Response('Unauthorized – no token', {
      status: 401,
      headers: { 'Access-Control-Allow-Origin': origin },
    })
  }

  // JWT auslesen
  let userId: string | null = null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    userId = payload.sub
  } catch (e) {
    return new Response('Invalid token', {
      status: 401,
      headers: { 'Access-Control-Allow-Origin': origin },
    })
  }

  if (!userId) {
    return new Response('Unauthorized – no user ID', {
      status: 401,
      headers: { 'Access-Control-Allow-Origin': origin },
    })
  }

  // Supabase Admin Client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    return new Response(error.message, {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': origin },
    })
  }

  return new Response('User deleted', {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': origin },
  })
})
