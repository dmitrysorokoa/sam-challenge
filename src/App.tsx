import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { socket } from './socket';
import styles from './App.module.scss';
import { Controls } from './components/Controls/Controls';
import { Element } from './components/Element/Element';
import { Message } from './components/Message/Message';
import { Header } from './components/Header/Header';

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [voteStatus, setVoteStatus] = useState<boolean | null>(null);
  const [voteResult, setVoteResult] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const listRef = useRef<HTMLUListElement>(null);

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

    function onGetMessage(value: any) {
      setMessages((previous) => [...previous, value]);

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
      setMessages([]);
      setVoteResult(null);
    }

    function onVoteEnd() {
      setVoteStatus(false);
    }

    function onVoteStatus(value: boolean) {
      setVoteStatus(value);
    }

    function onVoteResult(value: any) {
      value.pros.sort((a: any, b: any) => a.likes - b.likes);
      value.cons.sort((a: any, b: any) => a.likes - b.likes);
      setVoteResult(value);
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
    <>
      <Header voteStatus={voteStatus} isConnected={isConnected} />
      <div className={styles.app}>
        <Typography variant="h6" gutterBottom>
          Pros And Cons Of Living In Australia
        </Typography>
        <Controls
          voteStatus={voteStatus}
          time={`Vote time: ${voteResult?.time || '00:00'}`}
          votesCount={`Votes count: ${voteResult?.voteCount || 0}`}
        />
        <div className={styles.wrap}>
          <ul ref={listRef} className={styles.list}>
            {messages.slice(-1000).map((message) => (
              <Message key={message.id} {...message} />
            ))}
          </ul>
          {voteResult && (
            <div className={styles.resultContainer}>
              {!!voteResult.pros?.length && (
                <ul>
                  {voteResult.pros.map((pro: any) => (
                    <Element
                      key={pro.id}
                      {...pro}
                      type={'pro'}
                      voteStatus={voteStatus}
                    />
                  ))}
                </ul>
              )}
              {!!voteResult.cons?.length && (
                <ul>
                  {voteResult.cons.map((con: any) => (
                    <Element
                      key={con.id}
                      {...con}
                      type={'con'}
                      voteStatus={voteStatus}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
