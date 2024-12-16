"use client";

import { useEffect } from "react";
import { useMotionValue, motion, animate, useTransform } from "motion/react";
import { formatNumber, IFormatter } from "./utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatter?: IFormatter;
}

export default function AnimatedNumber({
  value,
  duration = 2,
  formatter,
}: AnimatedNumberProps) {
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) =>
    formatNumber(latest, value, formatter),
  );

  useEffect(() => {
    const controls = animate(count, value, { duration });

    return () => controls.stop();
  }, []);

  return <motion.span>{rounded}</motion.span>;
}
