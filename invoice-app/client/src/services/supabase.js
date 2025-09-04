import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cdqbymbzzurskfctyhqm.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcWJ5bWJ6enVyc2tmY3R5aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTA5NTksImV4cCI6MjA3MjU2Njk1OX0.bMOMrQa7kucL8LiIA1j_S1n_wcV77TEbREYruPqk5oU'

export const supabase = createClient(supabaseUrl, supabaseKey)