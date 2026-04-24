import { useEffect, useState } from "react";
import {
  getAttentions,
  getSurveys,
  type Attention,
  type Survey,
} from "@/lib/supabase";

export function useStore() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [attentions, setAttentions] = useState<Attention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [surveysData, attentionsData] = await Promise.all([
        getSurveys(),
        getAttentions(),
      ]);
      setSurveys(surveysData || []);
      setAttentions(attentionsData || []);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error cargando datos";
      setError(message);
      console.error("Error fetching store data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return { surveys, attentions, loading, error, refetch: fetchData };
}
