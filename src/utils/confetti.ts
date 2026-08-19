import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#22d3ee', '#10b981']
    });
    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#22d3ee', '#10b981']
    });
  } catch (err) {
    console.log('Confetti trigger error', err);
  }
}

export function fireSmallSuccessConfetti() {
  try {
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b']
    });
  } catch (err) {
    console.log('Confetti trigger error', err);
  }
}
