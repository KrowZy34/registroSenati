import { useEffect, useState } from "react";
import { getAttentions, getSurveys, type Attention, type Survey } from "@/lib/store";

export function useStore() {
  const [surveys, setSurveys] = useState<Survey[]>(() => getSurveys());
  const [attentions, setAttentions] = useState<Attention[]>(() => getAttentions());

  useEffect(() => {
    const update = () => {
      setSurveys(getSurveys());
      setAttentions(getAttentions());
    };
    window.addEventListener("sim-store-update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("sim-store-update", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return { surveys, attentions };
}
