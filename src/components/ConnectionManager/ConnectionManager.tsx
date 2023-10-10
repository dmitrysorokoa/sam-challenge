import React, { FC } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { socket } from '../../socket';

interface ConnectionManagerProps {
  voteStatus: boolean | null;
  isConnected: boolean;
}

export const ConnectionManager: FC<ConnectionManagerProps> = ({
  voteStatus,
  isConnected,
}) => {
  const connect = () => {
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const voteStart = () => {
    socket.emit('vote start');
  };

  const voteEnd = () => {
    socket.emit('vote end');
  };

  return (
    <>
      <Typography
        variant="subtitle2"
        display="flex"
        sx={{ alignItems: 'center', margin: 1 }}
      >
        Connected to server:
        {isConnected ? (
          <DoneIcon color="success" />
        ) : (
          <CloseIcon color="error" />
        )}
      </Typography>
      <Divider />
      <Button
        sx={{ margin: 1 }}
        variant="contained"
        onClick={isConnected ? disconnect : connect}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>
      <Divider />
      <Typography
        variant="subtitle2"
        display="flex"
        sx={{ alignItems: 'center', margin: 1 }}
      >
        Vote started:
        {voteStatus ? (
          <DoneIcon color="success" />
        ) : (
          <CloseIcon color="error" />
        )}
      </Typography>
      <Divider />
      <Button
        sx={{ margin: 1 }}
        variant="contained"
        onClick={voteStatus ? voteEnd : voteStart}
        disabled={voteStatus === null || !isConnected}
      >
        {voteStatus ? 'Vote end' : 'Vote start'}
      </Button>
    </>
  );
};
