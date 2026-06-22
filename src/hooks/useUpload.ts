"use client";

import { useState } from "react";
import { uploadService } from "@/services/uploadService";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export function useUpload(onSuccess: () => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tradesInserted, setTradesInserted] = useState<number | null>(null);

  const upload = async (file: File) => {
    setError(null);
    setSuccess(false);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File too large. Maximum size is 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadService.upload(file);
      setTradesInserted(result.tradesInserted);
      setSuccess(true);
      onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, error, success, tradesInserted, upload };
}
