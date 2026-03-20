import { supabase } from "../lib/supabase.js";
import crypto from "crypto";

export const uploadModelToSupabase = async (
  fileBuffer: Buffer,
  originalName: string,
  tenantId: string,
): Promise<string> => {
  // 1. Create a unique file name to prevent accidental overwrites
  const fileExtension = originalName.split(".").pop();
  const uniqueId = crypto.randomUUID();
  const filePath = `${tenantId}/${uniqueId}.${fileExtension}`; // Organizes files by tenant in the bucket

  // 2. Upload the buffer to the 'lumina-models' bucket
  const { data, error } = await supabase.storage
    .from("lumina-models")
    .upload(filePath, fileBuffer, {
      contentType: "model/gltf-binary", // Standard MIME type for .glb files
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  // 3. Generate the public URL for the frontend to use
  const { data: publicUrlData } = supabase.storage
    .from("lumina-models")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
