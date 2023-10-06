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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const sendRequest = async (url) => {
  const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }

    return body;
}

const createChartData = (data) => {
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
  const [chartLinear, setChartLinear] = useState(null);
  const [chartNormal, setChartNormal] = useState(null);
  const [chartExp, setChartExp] = useState(null);
  const [chartBernoulli, setChartBernoulli] = useState(null);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [voteStatus, setVoteStatus] = useState(null);
  const [voteResult, setVoteResult] = useState(null);
  const [fooEvents, setFooEvents] = useState([]);

  const listRef = useRef();

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
    let interval;
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

    function onFooEvent(value) {
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

    function onVoteStatus(value) {
      setVoteStatus(value);
    }

    function onVoteResult(value) {
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
                {voteResult.pros.map(pro => 
                  <Element {...pro} type={'pro'} voteStatus={voteStatus} />
                )}
              </ul> 
            }
            {!!voteResult.cons?.length &&
              <ul>
                {voteResult.cons.map(con => 
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
