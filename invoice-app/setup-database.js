const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cdqbymbzzurskfctyhqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcWJ5bWJ6enVyc2tmY3R5aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTA5NTksImV4cCI6MjA3MjU2Njk1OX0.bMOMrQa7kucL8LiIA1j_S1n_wcV77TEbREYruPqk5oU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    console.log('🗄️ Setting up database...');
    
    try {
        // Test connection by trying to select from invoices table
        const { data, error } = await supabase
            .from('invoices')
            .select('count', { count: 'exact', head: true });
        
        if (error && error.code === 'PGRST116') {
            console.log('❌ Table "invoices" does not exist.');
            console.log('📋 Please create the table manually in Supabase Dashboard:');
            console.log('');
            console.log('1. Go to https://supabase.com/dashboard/project/cdqbymbzzurskfctyhqm');
            console.log('2. Navigate to SQL Editor');
            console.log('3. Run this SQL:');
            console.log('');
            console.log(`CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    vendor VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on invoices" ON invoices
    FOR ALL USING (true) WITH CHECK (true);`);
            console.log('');
        } else if (error) {
            console.log('❌ Database error:', error.message);
        } else {
            console.log('✅ Database connection successful!');
            console.log(`📊 Current invoice count: ${data || 0}`);
        }
    } catch (err) {
        console.log('❌ Setup failed:', err.message);
    }
}

setupDatabase();