import { supabase, hasSupabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

const bucketName = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "property-images";

export async function uploadPropertyImage(file, folder = "properties") {
  if (!hasSupabase) {
    return { success: false, error: new Error("Supabase is not configured.") };
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const filePath = `${folder}/${uuidv4()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: false });

  if (uploadError) return { success: false, error: uploadError };

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return {
    success: true,
    publicUrl: data.publicUrl,
    filePath,
  };
}
