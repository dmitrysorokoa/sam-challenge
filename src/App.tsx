import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { socket } from './socket';
import styles from './App.module.scss';
import { Controls } from './components/Controls/Controls';
import { Header } from './components/Header/Header';
import { MessagesList } from './components/MessagesList/MessagesList';
import { Result } from './components/Result/Result';
import { Box } from '@mui/material';
import { Distribution } from './server/distribution';

const theme = createTheme({});

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [voteStatus, setVoteStatus] = useState<boolean | null>(null);
  const [createdProAndCons, setCreatedProAndCons] = useState<any>([]);
  const [voteTime, setVoteTime] = useState<string>('00:00');
  const [votesChart, setVotesChart] = useState<any>({ time: [], votes: [] });
  const [showedMessages, setShowedMessages] = useState<any[]>([]);
  const [votesDistribution, setVotesDistribution] = useState(
    Distribution.LogNormalReverse,
  );
  const [elementsDistribution, setElementsDistribution] = useState(
    Distribution.LogNormal,
  );

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

    function onGetMessage(value: any[]) {
      const last500 = value.slice(-500);
      setShowedMessages(() => [...last500]);
    }

    function onVoteStart() {
      setVotesChart({ time: [], votes: [] });
      setVoteStatus(true);
      setShowedMessages([]);
      setCreatedProAndCons([]);
      setVoteTime('00:00');
    }

    function onVoteEnd() {
      setVoteStatus(false);
    }

    function onVoteStatus(value: boolean) {
      setVoteStatus(value);
    }

    function onVoteResult(value: any) {
      value.createdProsAndCons.sort((a: any, b: any) => b.likes - a.likes);
      setCreatedProAndCons(value.createdProsAndCons);
      setVoteTime(value.time);
      setVotesChart((previos: any) => {
        const time = [...previos.time, value.time];
        const votes = [
          ...previos.votes,
          value.createdProsAndCons.reduce(
            (acc: number, el: any) => acc + el.likes + el.dislikes,
            0,
          ),
        ];
        return { time, votes };
      });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat message', onGetMessage);
    socket.on('vote start', onVoteStart);
    socket.on('vote end', onVoteEnd);
    socket.on('vote status', onVoteStatus);
    socket.on('vote result', onVoteResult);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat message', onGetMessage);
      socket.off('vote start', onVoteStart);
      socket.off('vote end', onVoteEnd);
      socket.off('vote status', onVoteStatus);
      socket.off('vote result', onVoteResult);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Header
        votesDistribution={votesDistribution}
        elementsDistribution={elementsDistribution}
        voteStatus={voteStatus}
        isConnected={isConnected}
        votesChart={votesChart}
      />
      <div className={styles.app}>
        <Box>
          <Controls
            votesDistribution={votesDistribution}
            setVotesDistribution={setVotesDistribution}
            elementsDistribution={elementsDistribution}
            setElementsDistribution={setElementsDistribution}
            voteStatus={voteStatus}
            time={`Vote time: ${voteTime}`}
            votesCount={`Votes count: ${createdProAndCons.reduce(
              (acc: number, el: any) => acc + el.likes + el.dislikes,
              0,
            )}`}
          />
          <MessagesList messages={showedMessages} />
        </Box>
        <Result createdProAndCons={createdProAndCons} voteStatus={voteStatus} />
      </div>
    </ThemeProvider>
  );
};

export default App;
