import React, { useState, FC, Dispatch, SetStateAction } from 'react';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import styles from './Controls.module.scss';
import { socket } from '../../socket';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Distribution } from '../../server/distribution';

interface ControlsProps {
  voteStatus: boolean | null;
  time: string;
  votesCount: string;
  votesDistribution: Distribution;
  setVotesDistribution: Dispatch<SetStateAction<Distribution>>;
  elementsDistribution: Distribution;
  setElementsDistribution: Dispatch<SetStateAction<Distribution>>;
}

export const Controls: FC<ControlsProps> = ({
  voteStatus,
  time,
  votesCount,
  votesDistribution,
  setVotesDistribution,
  elementsDistribution,
  setElementsDistribution,
}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('pro');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeVotesDistribution = (event: SelectChangeEvent) => {
    setVotesDistribution(event.target.value as Distribution);
  };

  const handleChangeElementsDistribution = (event: SelectChangeEvent) => {
    setElementsDistribution(event.target.value as Distribution);
  };

  const onClick = () => {
    setIsLoading(true);

    socket.timeout(1000).emit('add pro or con', { type, text: value }, () => {
      setIsLoading(false);
    });

    setValue('');
  };

  return (
    <div>
      <div className={styles.controlInfo}>
        <Typography variant="subtitle1" gutterBottom>
          {time}
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="subtitle1" gutterBottom>
          {votesCount}
        </Typography>
      </div>
      <div className={styles.container}>
        <Typography variant="body1">Con</Typography>
        <Switch
          checked={type === 'pro'}
          onChange={(e) => setType(e.target.checked ? 'pro' : 'con')}
        />
        <Typography variant="body1">Pro</Typography>
        <TextField
          sx={{ width: '100%' }}
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label="Pro/Con text"
          variant="outlined"
          disabled={isLoading || !voteStatus}
          inputProps={{ maxLength: 20 }}
        />
        <Button
          disabled={isLoading || !voteStatus}
          variant="contained"
          onClick={onClick}
        >
          Add
        </Button>
      </div>
      <Box sx={{ marginTop: 1, display: 'flex', gap: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Votes Distribution
          </InputLabel>
          <Select
            value={votesDistribution}
            label="Votes Distribution"
            onChange={handleChangeVotesDistribution}
          >
            {Object.keys(Distribution).map((el) => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Elements Distribution
          </InputLabel>
          <Select
            value={elementsDistribution}
            label="Elements Distribution"
            onChange={handleChangeElementsDistribution}
          >
            {Object.keys(Distribution).map((el) => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};
