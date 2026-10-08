import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createClerkSubpabaseClient } from "../lib/supabase";

export function useSupabase() {
  const { getToken } = useAuth();

  const client = useMemo(
    () => createClerkSubpabaseClient(() => getToken()),
    [getToken],
  );

  return client;
}
