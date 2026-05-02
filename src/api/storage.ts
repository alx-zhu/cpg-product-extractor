import { supabase } from "@/clients/supabase";

const STORAGE_BUCKET = "uploads";

export function generateUniqueFilename(originalName: string): string {
  const extension = originalName.split(".").pop() || "pdf";
  const baseName = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${sanitized}-${timestamp}-${randomStr}.${extension}`;
}

export async function savePdfToStorage(file: File): Promise<string> {
  const filename = generateUniqueFilename(file.name);
  const filePath = `public/${filename}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(`Failed to upload PDF: ${error.message}`);
  return data.path;
}

export function getPdfUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePdfFromStorage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) throw new Error(`Failed to delete PDF: ${error.message}`);
}
