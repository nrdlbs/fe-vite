Setup instructions for Supabase Waitlist

1) Create table
   - In Supabase SQL editor, run `supabase/sql/01_waitlist.sql` from this repo.

2) Deploy Edge Function
   - Create a new Edge Function named `waitlist-signup`.
   - Use the source in `supabase/functions/waitlist-signup/mod.ts`.
   - Set environment variables for the function:
     - `SUPABASE_URL`: your Supabase project URL
     - `SUPABASE_SERVICE_ROLE_KEY`: service role key (keep secret)

3) Get function URL
   - After deploy, copy the invoke URL, typically:
     https://<project-ref>.functions.supabase.co/waitlist-signup

4) Frontend env
   - Add `.env` with:
     - `VITE_SUPABASE_EDGE_URL=https://<project-ref>.functions.supabase.co/waitlist-signup`

5) Run frontend
   - `pnpm dev`


