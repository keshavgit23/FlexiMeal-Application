import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import { getRecentPaymentStatus } from "../apis/mess-partner/getRecentPaymentStatus.api";

interface RecentPaymentStatus {
  hasRecentPayments: boolean;
  pendingCount: number;
}

export const useRecentPaymentStatus = () => {
  const { getToken } = useAuth();

  const [status, setStatus] = useState<RecentPaymentStatus>({
    hasRecentPayments: false,
    pendingCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();

        if (!token) {
          throw new Error("Authentication required");
        }

        const result = await getRecentPaymentStatus(token);

        setStatus({
          hasRecentPayments: result.data?.hasRecentPayments ?? false,
          pendingCount: result.data?.pendingCount ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch recent payment status:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch recent payment status"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [getToken]);

  return {
    hasRecentPayments: status.hasRecentPayments,
    pendingCount: status.pendingCount,
    loading,
    error,
  };
};