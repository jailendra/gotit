// src/app/index.tsx
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getAuthToken } from "../hooks/useAuthStorage";

type Dest = "/login" | "/(tabs)/home";

export default function Index() {
  const [dest, setDest] = useState<Dest | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getAuthToken();
      setDest((token ? "/(tabs)/home" : "/login") as Dest);
    })();
  }, []);

  if (!dest) return null; // or a splash/loading view
  return <Redirect href={dest} />;
}