import { useCallback, useEffect, useRef, useState } from "react";

export function useCooldown(seconds: number) {
  const [remaining, setRemaining] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(
    (override?: number) => {
      const duration = override ?? seconds;
      setRemaining(duration);

      if (timer.current) clearInterval(timer.current);

      timer.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer.current!);
            timer.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [seconds],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return { remaining, active: remaining > 0, start };
}
