import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface Invoice {
  id?: number;
  vendor: string;
  product: string;
  amount: number;
  date: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/invoice-api', '')
    const method = req.method

    // Route handling
    if (path === '/invoice' || path === '/invoice/') {
      if (method === 'GET') {
        // Get all invoices
        const { data, error } = await supabaseClient
          .from('invoices')
          .select('*')
          .order('id', { ascending: false })

        if (error) throw error

        return new Response(
          JSON.stringify(data),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      } else if (method === 'POST') {
        // Create new invoice
        const invoice: Invoice = await req.json()
        
        const { data, error } = await supabaseClient
          .from('invoices')
          .insert([{
            vendor: invoice.vendor,
            product: invoice.product,
            amount: invoice.amount,
            date: invoice.date
          }])
          .select()

        if (error) throw error

        return new Response(
          JSON.stringify(data[0]),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201 
          }
        )
      }
    } else if (path.startsWith('/invoice/') && method === 'DELETE') {
      // Delete invoice
      const id = path.split('/')[2]
      
      const { error } = await supabaseClient
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error

      return new Response(
        JSON.stringify({ message: 'Invoice deleted successfully' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})