import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yjgasqonqurlirnftfxl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZ2FzcW9ucXVybGlybmZ0ZnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTAxMjksImV4cCI6MjA1NTI2NjEyOX0.4WbIdz3vcZ8RbSN_0MU91B0wov6yDA2BME3EDYf_ZKc";

// const SUPABASE_URL = import.meta.env.SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
