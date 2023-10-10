import React, { useState, FC } from 'react';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import styles from './Controls.module.scss';
import { socket } from '../../socket';

interface ControlsProps {
  voteStatus: boolean | null;
  time: string;
  votesCount: string;
}

export const Controls: FC<ControlsProps> = ({
  voteStatus,
  time,
  votesCount,
}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('pro');
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    setIsLoading(true);

    socket.timeout(1000).emit('add pro or con', { type, text: value }, () => {
      setIsLoading(false);
    });

    setValue('');
  };

  return (
    <div className={styles.controlContainer}>
      <div className={styles.controlInfo}>
        <Typography variant="subtitle1" gutterBottom>
          {time}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {votesCount}
        </Typography>
      </div>
      <Divider orientation="vertical" flexItem />
      <div className={styles.container}>
        <Typography variant="body1">Con</Typography>
        <Switch
          checked={type === 'pro'}
          onChange={(e) => setType(e.target.checked ? 'pro' : 'con')}
        />
        <Typography variant="body1">Pro</Typography>
        <TextField
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label="Pro/Con text"
          variant="outlined"
          disabled={isLoading || !voteStatus}
        />
        <Button
          disabled={isLoading || !voteStatus}
          variant="contained"
          onClick={onClick}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
