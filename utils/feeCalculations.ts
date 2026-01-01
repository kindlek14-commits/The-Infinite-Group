
export const LATE_FEE_RULES = {
  GRACE_PERIOD_END: 5,
  INITIAL_FEE: 50,
  DAILY_FEE: 10,
  MAX_TOTAL_FEE: 300,
};

/**
 * Calculates late fees based on the day of the month.
 * @param dayOfMonth The current day of the month (1-31)
 * @returns The total late fee amount
 */
export const calculateLateFeeAmount = (dayOfMonth: number): number => {
  if (dayOfMonth <= LATE_FEE_RULES.GRACE_PERIOD_END) {
    return 0;
  }

  // Day 6 is the first day fees apply
  const daysLateSinceSixth = dayOfMonth - 6;
  const total = LATE_FEE_RULES.INITIAL_FEE + (daysLateSinceSixth * LATE_FEE_RULES.DAILY_FEE);
  
  return Math.min(total, LATE_FEE_RULES.MAX_TOTAL_FEE);
};

export const getLateFeeDescription = (dayOfMonth: number): string => {
  if (dayOfMonth <= LATE_FEE_RULES.GRACE_PERIOD_END) return "Within Grace Period";
  if (dayOfMonth === 6) return "Initial Late Fee Applied";
  return `Daily Late Accrual (${dayOfMonth - 6} days past grace)`;
};
