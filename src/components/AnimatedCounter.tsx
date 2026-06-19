import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // duration in milliseconds
  delay?: number; // delay before starting in ms
  useBengali?: boolean;
}

export default function AnimatedCounter({ value, duration = 1500, delay = 0, useBengali = true }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  const convertToBengali = (num: number): string => {
    const digits: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).split('').map(char => digits[char] || char).join('');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let frameRate = 1000 / 60; // 60fps
    let totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const run = () => {
      timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        // Ease out quadratic
        const easeVal = progress * (2 - progress);
        const currentCount = Math.round(easeVal * value);

        if (frame >= totalFrames) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(currentCount);
        }
      }, frameRate);
    };

    const delayTimeout = setTimeout(() => {
      run();
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (timer) clearInterval(timer);
    };
  }, [value, duration, delay]);

  return <span className="font-bold select-none">{useBengali ? convertToBengali(count) : count}</span>;
}
