const getLinearDistribution = (count: number, a = 2, b = 5) => {
  const etalonExpectedValue = (a + 2 * b) / 3;
  const etalonVariance = Math.pow(b - a, 2) / 18;

  const nums = [];

  for (let i = 0; i < count; i++) {
    const r = Math.max(Math.random(), Math.random());
    nums.push(a + (b - a) * r);
  }

  return { nums, etalonExpectedValue, etalonVariance };
};

const getNormalDistributionNumber = (min = 1, max = 5, skew = 1) => {
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

const getNormalDistribution = (count: number) => {
  const nums = [];

  for (let i = 0; i < count; i++) {
    nums.push(getNormalDistributionNumber());
  }

  return { nums, etalonExpectedValue: 0, etalonVariance: 0 };
};

export enum Distribution {
  Normal,
  Linear,
}

const distributionMap = {
  [Distribution.Normal]: getNormalDistribution,
  [Distribution.Linear]: getLinearDistribution,
};

const getChartData = (nums: number[]) => {
  const min = 0,
    max = 7,
    step = 0.1;

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

export const getDistribution = (type: Distribution, count = 10000) => {
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
