"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { MentorRequest, ApiResponse } from "@/types/mentor.types";
import api from "@/config/axios.config";

interface UseApprovedMentorsReturn {
  approvedMentors: MentorRequest[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  approveMentor: (userName: string) => Promise<void>;
  deleteMentor: (userName: string) => Promise<void>;
  meta: {
    page: number;
    limit: number;
    total: number;
  } | null;
}

export function useApprovedMentors(): UseApprovedMentorsReturn {
  const [approvedMentors, setApprovedMentors] = useState<MentorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<MentorRequest>["meta"] | null>(
    null,
  );

  const handleAxiosError = (error: unknown) => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  const fetchApprovedMentors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<ApiResponse<MentorRequest>>(
        "/api/v1/mentors?adminApproval=true",
      );

      setApprovedMentors(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      setError(handleAxiosError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedMentors();
  }, [fetchApprovedMentors]);

  const approveMentor = async (userName: string) => {
    try {
      setIsLoading(true);
      await api.put(`/api/v1/mentors/${userName}`, {
        adminApproval: true,
      });

      await fetchApprovedMentors();
    } catch (err) {
      setError(handleAxiosError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMentor = async (id: string) => {
    console.log("USERNAME - deleteMentor", id);
    try {
      setIsLoading(true);
      await api.delete(`/api/v1/mentors/${id}`);

      await fetchApprovedMentors();
    } catch (err) {
      setError(handleAxiosError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    approveMentor,
    deleteMentor,
    approvedMentors,
    isLoading,
    error,
    refetch: fetchApprovedMentors,
    meta,
  };
}
