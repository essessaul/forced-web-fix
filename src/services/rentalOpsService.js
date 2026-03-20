import { supabase, hasSupabase } from "../lib/supabase";

async function query(table, propertyId) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from(table).select("*").eq("property_id", propertyId).order("created_at", { ascending: false });
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}

export async function listSeasonalRates(propertyId) {
  return query("seasonal_rates", propertyId);
}

export async function listBlockedDates(propertyId) {
  return query("blocked_dates", propertyId);
}

export async function listChannelConnections(propertyId) {
  return query("channel_connections", propertyId);
}

export async function createSeasonalRate(payload) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from("seasonal_rates").insert([payload]).select().single();
  if (error) return { success: false, error };
  return { success: true, data };
}

export async function createBlockedRange(payload) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from("blocked_dates").insert([payload]).select().single();
  if (error) return { success: false, error };
  return { success: true, data };
}

export async function createChannelConnection(payload) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from("channel_connections").insert([payload]).select().single();
  if (error) return { success: false, error };
  return { success: true, data };
}
