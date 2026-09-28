import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser/Client & Server Supabase Client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin Service Role Client (for backend storage / auth operations)
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * Upload a file to a Supabase Storage bucket
 */
export async function uploadToSupabaseStorage(
  bucket: string,
  filePath: string,
  fileBuffer: Buffer | Blob,
  contentType?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return { url: null, error: 'Supabase credentials not configured in .env' };
    }

    const { data, error } = await admin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = admin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Storage upload failed' };
  }
}
