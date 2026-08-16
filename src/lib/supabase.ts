import { createClient } from "@supabase/supabase-js";

const ws = typeof window === "undefined" ? require("ws") : undefined;

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
  ws ? { realtime: { transport: ws } } : {}
);

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  ws ? { realtime: { transport: ws } } : {}
);
