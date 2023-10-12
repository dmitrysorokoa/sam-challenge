import React, { FC, useState, useEffect, useMemo } from 'react';
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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  animation: {
    duration: 0,
  },
  scales: {
    y: {
      position: 'right',
    },
  },
};

const createChartData = (data: any, name: string = 'Dataset') => {
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
  const [chartVotesDistribution, setChartVotesDistribution] =
    useState<any>(null);
  const [chartElementsDistrubution, setChartElementsDistrubution] =
    useState<any>(null);
  const [samplesDistributions, setSamplesDistributions] = useState<any>({});

  const votesData = useMemo(() => {
    return {
      time: votesChart.time.filter((el, index) => index % 5 === 0),
      votes: votesChart.votes.filter((el, index) => index % 5 === 0),
    };
  }, [votesChart]);

  const getDistributions = async () => {
    try {
      const body = await sendRequest('/api/distributions');
      setChartElementsDistrubution(
        createChartData(
          body.elementsDistribution,
          'Pros and Cons distribution',
        ),
      );
      setChartVotesDistribution(
        createChartData(body.votesDistribution, 'Votes distribution'),
      );
      setSamplesDistributions({
        normal: createChartData(body.normal.chartData, 'normal'),
        linear: createChartData(body.linear.chartData, 'linear'),
        exp: createChartData(body.exp.chartData, 'exp'),
        logNormal: createChartData(body.logNormal.chartData, 'logNormal'),
        logNormalReverse: createChartData(
          body.logNormalReverse.chartData,
          'logNormalReverse',
        ),
        expReverse: createChartData(body.expReverse.chartData, 'expReverse'),
        linearReserve: createChartData(
          body.linearReserve.chartData,
          'linearReserve',
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getDistributions();
  }, []);

  return (
    <div className={styles.charts}>
      {votesData && (
        <div className={styles.chartContainer}>
          <Bar
            options={{
              ...options,
              scales: {
                y: {
                  position: 'right',
                  suggestedMin: 0,
                  suggestedMax: 10000,
                },
              },
            }}
            data={createChartData(
              {
                labels: chartVotesDistribution?.labels || votesData.time,
                data: votesData.votes,
              },
              'Votes',
            )}
          />
        </div>
      )}
      {chartVotesDistribution && (
        <div className={styles.chartContainer}>
          <Bar options={options} data={chartVotesDistribution} />
        </div>
      )}
      {chartElementsDistrubution && (
        <div className={styles.chartContainer}>
          <Bar options={options} data={chartElementsDistrubution} />
        </div>
      )}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Distributions samples</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(samplesDistributions).map((distribution) => (
            <div
              key={samplesDistributions[distribution].datasets[0].label}
              className={styles.chartContainer}
            >
              <Bar
                options={options}
                data={samplesDistributions[distribution]}
              />
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
