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

interface HeaderProps {
  voteStatus: boolean | null;
  isConnected: boolean;
}

export const Header: FC<HeaderProps> = ({ voteStatus, isConnected }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDrawer =
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
            onClick={toggleDrawer(true)}
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
            Code Battle
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isMenuOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <ConnectionManager
            voteStatus={voteStatus}
            isConnected={isConnected}
          />
        </Box>
      </Drawer>
    </>
  );
};
