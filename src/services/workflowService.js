import { supabase, hasSupabase } from "../lib/supabase";

export async function createSalesLead(payload) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from("sales_leads").insert([payload]).select().single();
  if (error) return { success: false, error };
  return { success: true, data };
}

export async function listSalesLeads() {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from("sales_leads").select("*").order("created_at", { ascending: false });
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}

export async function listOwnerStatements(ownerId) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  let query = supabase.from("owner_statements").select("*").order("statement_month", { ascending: false });
  if (ownerId) query = query.eq("owner_id", ownerId);
  const { data, error } = await query;
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}
