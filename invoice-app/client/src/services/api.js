import { supabase } from './supabase';

export const getAllInvoices = async () => {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        return { data };
    } catch (error) {
        console.log('Error: ', error.message);
        return { error: error.message };
    }
}

export const saveInvoice = async (payload) => {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .insert([{
                vendor: payload.vendor,
                product: payload.product,
                amount: parseFloat(payload.amount),
                date: payload.date
            }])
            .select();

        if (error) throw error;

        return { data: data[0] };
    } catch (error) {
        console.log('Error: ', error.message);
        return { error: error.message };
    }
}

export const deleteInvoice = async (id) => {
    try {
        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { data: { message: 'Invoice deleted successfully' } };
    } catch (error) {
        console.log('Error: ', error.message);
        return { error: error.message };
    }
}