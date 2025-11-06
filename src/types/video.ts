
export interface ExplanatoryVideo {
  id: string;
  title?: string;
  description?: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  created_at: string;
  uploaded_by?: string;
  thumbnail_url?: string;
  url?: string; // URL pública del video
}
