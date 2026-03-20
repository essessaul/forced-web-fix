import { supabase, hasSupabase } from "../lib/supabase";

function normalizeDate(date) {
  if (!date) return null;
  const d = new Date(date);
  d.setHours(0,0,0,0);
  return d;
}

function nightsBetween(start, end) {
  if (!start || !end) return 0;
  return Math.max(0, Math.round((normalizeDate(end) - normalizeDate(start)) / 86400000));
}

export async function createPersistentBooking(payload) {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };

  const nights = nightsBetween(payload.check_in, payload.check_out);

  const { data, error } = await supabase
    .from("bookings")
    .insert([{ ...payload, nights }])
    .select()
    .single();

  if (error) return { success: false, error };
  return { success: true, data };
}

export async function listBookingsForAdmin() {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };

  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(title, listing_type)")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}
