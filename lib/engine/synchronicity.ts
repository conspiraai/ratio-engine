export const PHI = (1 + Math.sqrt(5)) / 2;

export const fibonacciSequence = (length: number): number[] => {
  if (length <= 0) {
    return [];
  }

  if (length === 1) {
    return [1];
  }

  const sequence = [1, 1];

  for (let index = 2; index < length; index += 1) {
    const next = sequence[index - 1] + sequence[index - 2];
    sequence.push(next);
  }

  return sequence;
};

export const primeSieve = (limit: number): number[] => {
  if (limit < 2) {
    return [];
  }

  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;

  for (let value = 2; value * value <= limit; value += 1) {
    if (!sieve[value]) {
      continue;
    }
    for (let multiple = value * value; multiple <= limit; multiple += value) {
      sieve[multiple] = false;
    }
  }

  return sieve
    .map((isPrime, index) => (isPrime ? index : null))
    .filter((value): value is number => value !== null);
};

export const primeIndexed = <T,>(sequence: T[], primes: number[]): T[] =>
  primes
    .map((prime) => sequence[prime - 1])
    .filter((value): value is T => value !== undefined);

export const timeBasedRatio = (t: number): number => {
  const wave = Math.sin(t * 0.6) * 0.5 + 0.5;
  const drift = Math.cos(t * 0.17) * 0.08;
  return PHI * (0.94 + wave * 0.08) + drift;
};
