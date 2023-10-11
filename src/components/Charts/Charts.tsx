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
  ChartOptions,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
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

export const options: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  animation: {
    duration: 0,
  },
};

const createChartData = (data: any, name: string) => {
  return {
    labels: data.labels,
    datasets: [
      {
        label: name,
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

interface ChartsProps {
  votesChart: { time: string[]; votes: number[] };
}

export const Charts: FC<ChartsProps> = ({ votesChart }) => {
  const [chartLinear, setChartLinear] = useState<any>(null);
  const [chartNormal, setChartNormal] = useState<any>(null);
  const [chartExp, setChartExp] = useState<any>(null);
  const [chartLogNormal, setChartLogNormal] = useState<any>(null);

  const getDistributions = async () => {
    try {
      const body = await sendRequest('/api/distributions');
      setChartLinear(
        createChartData(body.linear.chartData, 'Linear distribution'),
      );
      setChartNormal(
        createChartData(body.normal.chartData, 'Normal distribution'),
      );
      setChartExp(createChartData(body.exp.chartData, 'Exp distribution'));
      setChartLogNormal(
        createChartData(body.logNormal.chartData, 'LogNormal distribution'),
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // getDistributions();
  }, []);

  return (
    <div className={styles.charts}>
      {votesChart && (
        <div className={styles.chartContainer}>
          <Line
            options={options}
            data={createChartData(
              {
                labels: votesChart.time,
                data: votesChart.votes,
              },
              'Votes',
            )}
          />
        </div>
      )}
      {/* {chartLinear && (
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
      {chartLogNormal && (
        <div className={styles.chartContainer}>
          <Bar options={options} data={chartLogNormal} />
        </div>
      )} */}
    </div>
  );
};
