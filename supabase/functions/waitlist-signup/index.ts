// @ts-nocheck
// Supabase Edge Function (Deno)
// Endpoint: /functions/v1/waitlist-signup
// Expects JSON: { email: string, source?: string }
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
}
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders,
        })
    }
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({
                error: 'Method not allowed',
            }),
            {
                status: 405,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
            },
        )
    }
    try {
        const { email, source } = await req.json()
        if (!email || typeof email !== 'string') {
            return new Response(
                JSON.stringify({
                    error: 'Email is required',
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json',
                    },
                },
            )
        }
        const ipHeader = req.headers.get('x-forwarded-for') ?? undefined
        const ip = ipHeader ? (ipHeader.split(',')[0]?.trim() ?? undefined) : undefined
        const userAgent = req.headers.get('user-agent') ?? undefined
        console.log(`Submit waiter with email ${email} from ${source} with IP: ${ip}`)

        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        if (!supabaseUrl || !supabaseServiceKey) {
            return new Response(
                JSON.stringify({
                    error: 'Missing service configuration',
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json',
                    },
                },
            )
        }
        const insertRes = await fetch(`${supabaseUrl}/rest/v1/waitlist_subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: supabaseServiceKey,
                Authorization: `Bearer ${supabaseServiceKey}`,
                Prefer: 'return=representation',
            },
            body: JSON.stringify({
                email,
                source,
                user_agent: userAgent,
                ip,
            }),
        })
        if (!insertRes.ok) {
            const body = await insertRes.text()
            return new Response(
                JSON.stringify({
                    error: 'Insert failed',
                    detail: body,
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json',
                    },
                },
            )
        }
        const json = await insertRes.json()
        return new Response(
            JSON.stringify({
                ok: true,
                data: json,
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
            },
        )
    } catch (err) {
        return new Response(
            JSON.stringify({
                error: 'Bad Request',
                detail: String(err),
            }),
            {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
            },
        )
    }
})
