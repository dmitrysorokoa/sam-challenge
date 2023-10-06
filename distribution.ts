import random from 'random';

const getLinearDistribution = (count: number, a = 0, b = 300) => {
  const etalonExpectedValue = (a + 2 * b) / 3;
  const etalonVariance = Math.pow(b - a, 2) / 18;

  const nums = [];

  for (let i = 0; i < count; i++) {
    const r = Math.max(Math.random(), Math.random());
    nums.push(a + (b - a) * r);
  }

  return { nums, etalonExpectedValue, etalonVariance };
};

export const getNormalDistributionNumber = (min = 0, max = 300, skew = 1) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = getNormalDistributionNumber(min, max, skew);
  else {
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
};

function intFromInterval(value: number, min = 0, max = 300) {
  return Math.floor(value * (max - min + 1) + min);
}

const getNormalDistribution = (count: number) => {
  const nums = [];

  for (let i = 0; i < count; i++) {
    nums.push(getNormalDistributionNumber());
  }

  return { nums, etalonExpectedValue: 0, etalonVariance: 0 };
};

const getExponentialDistribution = (count: number) => {
  const nums = [];

  const lambda = 7;

  const exp = random.exponential(lambda);

  for (let i = 0; i < count; i++) {
    nums.push(intFromInterval(exp()));
  }

  return {
    nums,
    etalonExpectedValue: (1 / lambda) * 300,
    etalonVariance: 1 / Math.pow(lambda / 300, 2),
  };
};

export const getLogNormalDistribution = (count: number) => {
  const nums = [];

  const logNormal = random.logNormal(0, 0.9);

  for (let i = 0; i < count; i++) {
    nums.push(intFromInterval(logNormal() / Math.PI));
  }

  return {
    nums: nums.filter((el) => el < 300 && el > 0),
    etalonExpectedValue: 0,
    etalonVariance: 0,
  };
};

export enum Distribution {
  Normal,
  Linear,
  Exp,
  Bernoulli,
}

const distributionMap = {
  [Distribution.Normal]: getNormalDistribution,
  [Distribution.Linear]: getLinearDistribution,
  [Distribution.Exp]: getExponentialDistribution,
  [Distribution.Bernoulli]: getLogNormalDistribution,
};

const getChartData = (nums: number[]) => {
  const min = 0,
    max = 300,
    step = 10;

  const count = Math.ceil((max - min) / step);
  const data = new Array(count).fill(0);

  nums.forEach((item) => {
    const section = Math.floor(item / step);
    if (section >= 0 && section < count) ++data[section];
  });

  const labels = new Array(count).fill(0).map((el, index) => {
    const first = Number((index * step).toFixed(2));
    const second = Number((first + step).toFixed(2));

    return `${first} - ${second}`;
  });

  return { count, data, labels };
};

export const getDistribution = (type: Distribution, count = 100000) => {
  const { nums, etalonExpectedValue, etalonVariance } =
    distributionMap[type](count);

  const sum = nums.reduce((acc, el) => acc + el, 0);
  const calculatedExpectedValue = sum / count;

  const dSUM = nums.reduce(
    (acc, el) => acc + Math.pow(el - calculatedExpectedValue, 2),
    0,
  );
  const calculatedVariance = dSUM / count;

  return {
    etalonExpectedValue,
    calculatedExpectedValue,
    etalonVariance,
    calculatedVariance,
    nums,
    chartData: getChartData(nums),
  };
};
