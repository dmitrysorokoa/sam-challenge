import React, { useState, FC } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import logoUrl from '../../assets/logo.png';
import { ConnectionManager } from '../ConnectionManager/ConnectionManager';
import { Button } from '@mui/material';
import { Charts } from '../Charts/Charts';

interface HeaderProps {
  voteStatus: boolean | null;
  isConnected: boolean;
  votesChart: { time: string[]; votes: number[] };
}

export const Header: FC<HeaderProps> = ({
  voteStatus,
  isConnected,
  votesChart,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChartsOpen, setIsChartsOpen] = useState(false);

  const toggleMenu =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setIsMenuOpen(open);
    };

  const toggleCharts =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setIsChartsOpen(open);
    };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenu(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            sx={{
              height: 50,
              width: 90,
            }}
            alt="Logo"
            src={logoUrl}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: 2 }}
          >
            Pros And Cons Of Living In Australia
          </Typography>
          <Button color="inherit" onClick={toggleCharts(true)}>
            Charts
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleMenu(false)}
          onKeyDown={toggleMenu(false)}
        >
          <ConnectionManager
            voteStatus={voteStatus}
            isConnected={isConnected}
          />
        </Box>
      </Drawer>
      <Drawer anchor="right" open={isChartsOpen} onClose={toggleCharts(false)}>
        <Box
          sx={{ width: 800 }}
          role="presentation"
          onClick={toggleCharts(false)}
          onKeyDown={toggleCharts(false)}
        >
          <Charts votesChart={votesChart} />
        </Box>
      </Drawer>
    </>
  );
};
