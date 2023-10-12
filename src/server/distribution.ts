import random from 'random';
import { convertMillisecondsInTime } from './helpers';
import { INIT_DISTRIBUTION_SIZE, VOTING_DURATION } from './constants';

function intFromInterval(value: number, min = 0, max = VOTING_DURATION) {
  return Math.floor(value * (max - min + 1) + min);
}

export const getNormalDistributionNumber = (
  min = 0,
  max = VOTING_DURATION,
  skew = 1,
) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 5.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = getNormalDistributionNumber(min, max, skew);
  else {
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
};

const getLinearDistribution = (
  reverse = false,
  count: number = INIT_DISTRIBUTION_SIZE,
  a = 0,
  b = VOTING_DURATION,
) => {
  let nums: number[] = [];

  for (let i = 0; i < count; i++) {
    const r = Math.max(Math.random(), Math.random());
    nums.push(a + (b - a) * r);
  }

  if (reverse) {
    nums = nums.map((el) => Math.abs(el - VOTING_DURATION));
  }

  return { nums };
};

const getNormalDistribution = (count: number = INIT_DISTRIBUTION_SIZE) => {
  let nums: number[] = [];

  for (let i = 0; i < count; i++) {
    nums.push(getNormalDistributionNumber());
  }

  nums = nums.filter((el: number) => el < VOTING_DURATION && el > 0);

  return { nums };
};

const getExponentialDistribution = (
  reverse = false,
  count: number = INIT_DISTRIBUTION_SIZE,
) => {
  let nums: number[] = [];

  const lambda = 4;

  const exp = random.exponential(lambda);

  for (let i = 0; i < count; i++) {
    nums.push(intFromInterval(exp()));
  }

  if (reverse) {
    nums = nums.map((el) => Math.abs(el - VOTING_DURATION));
  }

  return {
    nums,
  };
};

export const getLogNormalDistribution = (
  reverse = false,
  count: number = INIT_DISTRIBUTION_SIZE,
) => {
  let nums: number[] = [];

  const logNormal = random.logNormal(0, 0.8);

  for (let i = 0; i < count; i++) {
    nums.push(intFromInterval(logNormal() / Math.PI));
  }

  nums = nums.filter((el: number) => el < VOTING_DURATION && el > 0);

  if (reverse) {
    nums = nums.map((el) => Math.abs(el - VOTING_DURATION));
  }

  return {
    nums,
  };
};

export enum Distribution {
  Normal = 'Normal',
  Linear = 'Linear',
  Exp = 'Exp',
  LogNormal = 'LogNormal',
  LogNormalReverse = 'LogNormalReverse',
  ExpReverse = 'ExpReverse',
  LinearReverse = 'LinearReverse',
}

const distributionMap = {
  [Distribution.Normal]: getNormalDistribution,
  [Distribution.Linear]: getLinearDistribution,
  [Distribution.Exp]: getExponentialDistribution,
  [Distribution.LogNormal]: getLogNormalDistribution,
  [Distribution.LogNormalReverse]: () => getLogNormalDistribution(true),
  [Distribution.ExpReverse]: () => getExponentialDistribution(true),
  [Distribution.LinearReverse]: () => getLinearDistribution(true),
};

export const getChartData = (nums: number[], step = 5000) => {
  const min = 0,
    max = VOTING_DURATION;

  const count = Math.ceil((max - min) / step);
  const data: number[] = new Array(count).fill(0);

  nums.forEach((item) => {
    const section = Math.floor(item / step);
    if (section >= 0 && section < count) ++data[section];
  });

  const labels = new Array(count).fill(0).map((el, index) => {
    const first = Number((index * step).toFixed(2));
    const second = Number((first + step).toFixed(2));

    return `${convertMillisecondsInTime(
      first,
      false,
    )} - ${convertMillisecondsInTime(second, false)}`;
  });

  return { count, data, labels };
};

export const getDistribution = (type: Distribution) => {
  const { nums } = distributionMap[type]();

  return {
    nums,
    chartData: getChartData(nums),
  };
};

export const DISTRUBUTION_SAMPLES = {
  normal: { ...getDistribution(Distribution.Normal) },
  linear: { ...getDistribution(Distribution.Linear) },
  exp: { ...getDistribution(Distribution.Exp) },
  logNormal: { ...getDistribution(Distribution.LogNormal) },
  logNormalReverse: { ...getDistribution(Distribution.LogNormalReverse) },
  expReverse: { ...getDistribution(Distribution.ExpReverse) },
  linearReserve: { ...getDistribution(Distribution.LinearReverse) },
};
