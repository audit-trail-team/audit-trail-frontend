import { useState, useEffect, PropsWithChildren } from "react";

export function ForceClient({ children }: PropsWithChildren<{}>) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <>{children}</>; //
}
