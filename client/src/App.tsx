import React, { useEffect, useRef, useState } from 'react';
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
import { serverUrl } from './constants';
import { socket } from './socket';
import { Bar } from 'react-chartjs-2';
import styles from './App.module.scss';
import { ConnectionManager } from './ConnectionManager';
import { MyForm } from './components/MyForm/MyForm';
import { Element } from './components/Element/Element';

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

const sendRequest = async (url: string) => {
  const response = await fetch(`${serverUrl}${url}`);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }

    return body;
}

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
  }
}

function App() {
  const [chartLinear, setChartLinear] = useState<any>(null);
  const [chartNormal, setChartNormal] = useState<any>(null);
  const [chartExp, setChartExp] = useState<any>(null);
  const [chartBernoulli, setChartBernoulli] = useState<any>(null);

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [voteStatus, setVoteStatus] = useState<boolean | null>(null);
  const [voteResult, setVoteResult] = useState<any>(null);
  const [fooEvents, setFooEvents] = useState<any[]>([]);

  const listRef = useRef<HTMLUListElement>(null);

  const getDistributions = async () => {
    try {
      const body = await sendRequest('/api/distributions')
      setChartLinear(createChartData(body.linear.chartData))
      setChartNormal(createChartData(body.normal.chartData))
      setChartExp(createChartData(body.exp.chartData))
      setChartBernoulli(createChartData(body.bernoulli.chartData))
    } catch (e) {
      console.error(e)
    }
  };



  useEffect(() => {
    socket.emit('vote status');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (voteStatus) {
      interval = setInterval(() => {
        socket.emit('vote result');
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [voteStatus]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      setFooEvents(previous => [...previous, value]);

      // if (listRef.current) {
      //   const threshold = 50
      //   const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      //   const isNearBottom = scrollTop + clientHeight + threshold >= scrollHeight;

      //   if (isNearBottom) {
      //     listRef.current.scrollTo(0, listRef.current?.scrollHeight);
      //   } 
      // }
    }

    function onVoteStart() {
      setVoteStatus(true);
      setFooEvents([])
      setVoteResult(null);
    }

    function onVoteEnd() {
      setVoteStatus(false);
    }

    function onVoteStatus(value: boolean) {
      setVoteStatus(value);
    }

    function onVoteResult(value: any) {
      setVoteResult(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat message', onFooEvent);
    socket.on('vote start', onVoteStart);
    socket.on('vote end', onVoteEnd);
    socket.on('vote status', onVoteStatus);
    socket.on('vote result', onVoteResult);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat message', onFooEvent);
      socket.off('vote start', onVoteStart);
      socket.off('vote end', onVoteEnd);
      socket.off('vote status', onVoteStatus);
      socket.off('vote result', onVoteResult);
    };
  }, []);

  useEffect(() => {
    getDistributions();
  }, [])

  return (
    <div className={styles.app}>
      Pros And Cons Of Living In Australia
      <p>Connected to server: { '' + isConnected }</p>
      <p>Vote started: { '' + voteStatus }</p>
      <ConnectionManager voteStatus={voteStatus}/>
      <p>Vote time: { '' + (voteResult?.time || '0:0') }</p>
      <p>Votes count: { '' + (voteResult?.voteCount || 0) }</p>
      <MyForm voteStatus={voteStatus} />
      <div className={styles.wrap}>
        <ul ref={listRef} className={styles.list}>
          {
            fooEvents.slice(-1000).map((event) =>
              <li key={ event.id }>{ event.message }</li>
            )
          }
        </ul>
        {voteResult && 
          <div className={styles.resultContainer}>
            {!!voteResult.pros?.length &&
              <ul>
                {voteResult.pros.map((pro: any) => 
                  <Element {...pro} type={'pro'} voteStatus={voteStatus} />
                )}
              </ul> 
            }
            {!!voteResult.cons?.length &&
              <ul>
                {voteResult.cons.map((con: any) => 
                  <Element {...con} type={'con'} voteStatus={voteStatus} />
                )}
              </ul> 
            }
          </div>
        }
      </div>
      <div className={styles.charts}>
        {chartLinear && <div className={styles.chartContainer}><Bar options={options} data={chartLinear} /></div>}
        {chartNormal && <div className={styles.chartContainer}><Bar options={options} data={chartNormal} /></div>}
        {chartExp && <div className={styles.chartContainer}><Bar options={options} data={chartExp} /></div>}
        {chartBernoulli && <div className={styles.chartContainer}><Bar options={options} data={chartBernoulli} /></div>}
      </div>
    </div>
  );
}

export default App;
