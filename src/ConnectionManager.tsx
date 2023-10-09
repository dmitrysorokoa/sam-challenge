import React, { FC } from 'react';
import { socket } from './socket';

interface ConnectionManagerProps {
  voteStatus: boolean | null;
}

export const ConnectionManager: FC<ConnectionManagerProps> = ({
  voteStatus,
}) => {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  function voteStart() {
    socket.emit('vote start');
  }

  function voteEnd() {
    socket.emit('vote end');
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <br />
      <br />
      <button
        disabled={voteStatus === true || voteStatus === null}
        onClick={voteStart}
      >
        Vote start
      </button>
      <button
        disabled={voteStatus === false || voteStatus === null}
        onClick={voteEnd}
      >
        Vote end
      </button>
    </>
  );
};
