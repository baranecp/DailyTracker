"use client";

import { useEffect, useState } from "react";

export function usePersistentState<T>(loadFn: () => T, saveFn: (value: T) => void) {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    setState(loadFn());
  }, [loadFn]);

  useEffect(() => {
    if (state != null) saveFn(state);
  }, [saveFn, state]);

  return { state, setState };
}
