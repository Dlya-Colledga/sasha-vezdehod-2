import { useEffect, useState } from "react";

export function useAtmosphere() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      setPlaying(false);
      return;
    }

    let context;

    try {
      context = new AudioContext();
    } catch {
      setPlaying(false);
      return;
    }

    let disposed = false;
    let index = 0;

    const notes = [220, 261.63, 329.63, 392, 329.63, 261.63, 293.66, 246.94];

    const play = () => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = notes[index++ % notes.length];

      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.035, context.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.8);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };

      oscillator.start();
      oscillator.stop(context.currentTime + 2);
    };

    context.resume().catch(() => {
      if (!disposed) setPlaying(false);
    });

    play();

    const timer = setInterval(play, 900);

    return () => {
      disposed = true;
      clearInterval(timer);
      context.close().catch(() => {});
    };
  }, [playing]);

  return [playing, () => setPlaying((value) => !value)];
}
