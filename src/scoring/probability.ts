/**
 * Probability helpers. Content files call these to COMPUTE answers to
 * base-rate and updating items, so no answer is ever worked out by hand.
 */

export interface TestParams {
  /** Fraction of the population with the condition, 0–1. */
  prevalence: number;
  /** P(positive | condition). */
  sensitivity: number;
  /** P(negative | no condition). */
  specificity: number;
}

/** P(condition | positive result), by Bayes' rule. */
export function bayesPosterior({ prevalence, sensitivity, specificity }: TestParams): number {
  const truePos = prevalence * sensitivity;
  const falsePos = (1 - prevalence) * (1 - specificity);
  return truePos / (truePos + falsePos);
}

/** P(condition | negative result). */
export function bayesPosteriorNegative({ prevalence, sensitivity, specificity }: TestParams): number {
  const falseNeg = prevalence * (1 - sensitivity);
  const trueNeg = (1 - prevalence) * specificity;
  return falseNeg / (falseNeg + trueNeg);
}

export interface PopulationCounts {
  truePositive: number;
  falseNegative: number;
  falsePositive: number;
  trueNegative: number;
}

/**
 * Expected whole-number counts in a population of `population` people.
 * Rounds each group, then fixes any rounding drift so the four counts sum to the population.
 */
export function expectedCounts(population: number, p: TestParams): PopulationCounts {
  const sick = Math.round(population * p.prevalence);
  const healthy = population - sick;
  const truePositive = Math.round(sick * p.sensitivity);
  const falsePositive = Math.round(healthy * (1 - p.specificity));
  return {
    truePositive,
    falseNegative: sick - truePositive,
    falsePositive,
    trueNegative: healthy - falsePositive,
  };
}

/** Update probability p by a likelihood ratio (Bayes' rule in odds form). */
export function oddsUpdate(p: number, likelihoodRatio: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  const odds = (p / (1 - p)) * likelihoodRatio;
  return odds / (1 + odds);
}

/** Apply a sequence of likelihood ratios from a prior; returns the probability after each step. */
export function updateTrajectory(prior: number, likelihoodRatios: number[]): number[] {
  const out: number[] = [];
  let p = prior;
  for (const lr of likelihoodRatios) {
    p = oddsUpdate(p, lr);
    out.push(p);
  }
  return out;
}

/** Round to a given number of decimal places (for display and comparisons). */
export function round(x: number, dp = 1): number {
  const f = 10 ** dp;
  return Math.round(x * f) / f;
}
