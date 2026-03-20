import { supabase, hasSupabase } from "../lib/supabase";

export async function listPropertiesCrud(listingType = null) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };

  let query = supabase.from("properties").select("*").order("created_at", { ascending: false });
  if (listingType) query = query.eq("listing_type", listingType);

  const { data, error } = await query;
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}

export async function createPropertyCrud(payload) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from("properties").insert([payload]).select().single();
  if (error) return { success: false, error };
  return { success: true, data };
}

export async function updatePropertyCrud(id, payload) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from("properties").update(payload).eq("id", id).select().single();
  if (error) return { success: false, error };
  return { success: true, data };
}

export async function deletePropertyCrud(id) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { success: false, error };
  return { success: true };
}
