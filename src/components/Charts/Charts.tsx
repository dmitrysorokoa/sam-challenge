import React, { FC, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { serverUrl } from '../../constants';
import styles from './Charts.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

export const options: any = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const createChartData = (data: any) => {
  return {
    labels: data.labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: data.data,
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
      },
    ],
  };
};

const sendRequest = async (url: string) => {
  const response = await fetch(`${serverUrl}${url}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

interface ChartsProps {}

export const Charts: FC<ChartsProps> = ({}) => {
  const [chartLinear, setChartLinear] = useState<any>(null);
  const [chartNormal, setChartNormal] = useState<any>(null);
  const [chartExp, setChartExp] = useState<any>(null);
  const [chartBernoulli, setChartBernoulli] = useState<any>(null);

  const getDistributions = async () => {
    try {
      const body = await sendRequest('/api/distributions');
      setChartLinear(createChartData(body.linear.chartData));
      setChartNormal(createChartData(body.normal.chartData));
      setChartExp(createChartData(body.exp.chartData));
      setChartBernoulli(createChartData(body.bernoulli.chartData));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getDistributions();
  }, []);

  return (
    <div className={styles.charts}>
      {chartLinear && (
        <div className={styles.chartContainer}>
          <Bar options={options} data={chartLinear} />
        </div>
      )}
      {chartNormal && (
        <div className={styles.chartContainer}>
          <Bar options={options} data={chartNormal} />
        </div>
      )}
      {chartExp && (
        <div className={styles.chartContainer}>
          <Bar options={options} data={chartExp} />
        </div>
      )}
      {chartBernoulli && (
        <div className={styles.chartContainer}>
          <Bar options={options} data={chartBernoulli} />
        </div>
      )}
    </div>
  );
};
