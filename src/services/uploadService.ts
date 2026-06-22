import { useAuthStore } from "@/store/authStore";

export interface UploadResult {
  success: boolean;
  tradesInserted: number;
  tradesSkipped: number;
}

export const uploadService = {
  upload: async (file: File): Promise<UploadResult> => {
    const token = useAuthStore.getState().token;
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      // Do NOT set Content-Type — browser sets it with the multipart boundary
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        (data as { error?: string }).error ?? "Upload failed",
      );
    }

    return data as UploadResult;
  },
};
