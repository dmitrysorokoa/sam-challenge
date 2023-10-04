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
import logo from './logo.svg';
import styles from './App.module.scss';
import { ConnectionManager } from './ConnectionManager';
import { MyForm } from './MyForm';

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

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
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

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [voteStatus, setVoteStatus] = useState(null);
  const [fooEvents, setFooEvents] = useState([]);

  const listRef = useRef();

  const getLinearDistribution = async () => {
    try {
      const body = await sendRequest('/api/linear-distribution')
      setChartLinear(createChartData(body.chartData))
    } catch (e) {
      console.error(e)
    }
  };

  const getNormalDistribution = async () => {
    try {
      const body = await sendRequest('/api/normal-distribution')
      setChartNormal(createChartData(body.chartData))
    } catch (e) {
      console.error(e)
    }
  };

  useEffect(() => {
    socket.emit('vote status');
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
      listRef.current?.scrollTo(0, listRef.current?.scrollHeight);
    }

    function onVoteStart() {
      setVoteStatus(true);
      setFooEvents([])
    }

    function onVoteEnd() {
      setVoteStatus(false);
    }

    function onVoteStatus(value) {
      setVoteStatus(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat message', onFooEvent);
    socket.on('vote start', onVoteStart);
    socket.on('vote end', onVoteEnd);
    socket.on('vote status', onVoteStatus);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat message', onFooEvent);
      socket.off('vote start', onVoteStart);
      socket.off('vote end', onVoteEnd);
      socket.off('vote status', onVoteStatus);
    };
  }, []);

  useEffect(() => {
    getNormalDistribution();
    getLinearDistribution();
  }, [])

  return (
    <div className="App">
      <p>State: { '' + isConnected }</p>
      <p>Vote status: { '' + voteStatus }</p>
      <ul ref={listRef} className={styles.list}>
        {
          fooEvents.map((event, index) =>
            <li key={ index }>{ event }</li>
          )
        }
      </ul>
    <ConnectionManager voteStatus={voteStatus}/>
    <MyForm />
      {chartLinear && <Bar options={options} data={chartLinear} />}
      {chartNormal && <Bar options={options} data={chartNormal} />}
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
}

export default App;
