export type WaitlistResponse = { ok: true } | { error: string; detail?: string }

export async function submitWaitlistEmail(email: string, source?: string): Promise<WaitlistResponse> {
    const baseUrl = import.meta.env.VITE_SUPABASE_EDGE_URL as string | undefined
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

    if (!baseUrl) {
        return { error: 'Edge function URL not configured (VITE_SUPABASE_EDGE_URL)' }
    }

    if (!anonKey) {
        return { error: 'Supabase anon key missing (VITE_SUPABASE_ANON_KEY)' }
    }

    const normalizedBase = baseUrl.endsWith('/waitlist-signup')
        ? baseUrl
        : `${baseUrl.replace(/\/$/, '')}/waitlist-signup`

    try {
        const res = await fetch(normalizedBase, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${anonKey}`,
                apikey: anonKey,
            },
            body: JSON.stringify({ email, source }),
        })

        if (!res.ok) {
            const text = await res.text()
            return { error: 'Request failed', detail: text }
        }

        const data = await res.json()
        return data.ok ? { ok: true } : { error: 'Unexpected response' }
    } catch (err) {
        return { error: 'Network error', detail: String(err) }
    }
}
