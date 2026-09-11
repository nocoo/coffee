import { useCallback, useEffect, useRef, useState } from 'react';

export function useAmbientSound() {
  const engine = useRef<{ context: AudioContext; master: GainNode } | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(25);
  const enabledRef = useRef(false);

  const toggle = useCallback(async () => {
    if (enabledRef.current) {
      if (engine.current) await engine.current.context.suspend();
      enabledRef.current = false;
      setEnabled(false);
      return;
    }
    // This function is invoked only by a user click. No audio object exists before consent.
    if (!engine.current) {
      const context = new AudioContext();
      const master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
      [130.8128, 196, 261.6256].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        const voice = context.createGain();
        voice.gain.value = 0.25 / (index + 1);
        const modulation = context.createOscillator();
        const depth = context.createGain();
        modulation.frequency.value = 0.06 + index * 0.025;
        depth.gain.value = 0.06 / (index + 1);
        modulation.connect(depth).connect(voice.gain);
        oscillator.connect(voice).connect(master);
        oscillator.start();
        modulation.start();
      });
      engine.current = { context, master };
    }
    await engine.current.context.resume();
    engine.current.master.gain.setTargetAtTime(
      (volume / 100) * 0.16,
      engine.current.context.currentTime,
      0.7,
    );
    enabledRef.current = true;
    setEnabled(true);
  }, [volume]);

  const ping = useCallback(() => {
    const current = engine.current;
    if (!enabledRef.current || !current || current.context.state !== 'running') return;
    const oscillator = current.context.createOscillator();
    const gain = current.context.createGain();
    const now = current.context.currentTime;
    oscillator.frequency.value = 523.251;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    oscillator.connect(gain).connect(current.master);
    oscillator.start(now);
    oscillator.stop(now + 0.5);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }, []);

  useEffect(() => {
    if (engine.current)
      engine.current.master.gain.setTargetAtTime(
        (volume / 100) * 0.16,
        engine.current.context.currentTime,
        0.2,
      );
  }, [volume]);

  useEffect(() => {
    const visibility = () => {
      const current = engine.current;
      if (!current) return;
      if (document.hidden) void current.context.suspend();
      else if (enabledRef.current)
        void current.context.resume().catch(() => {
          enabledRef.current = false;
          setEnabled(false);
        });
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(
    () => () => {
      if (engine.current) void engine.current.context.close();
      engine.current = null;
    },
    [],
  );
  return { enabled, volume, setVolume, toggle, ping };
}
