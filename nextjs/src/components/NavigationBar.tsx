'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import Image from 'next/image';
import WalletConnectButton from './WalletConnectButton';
import MenuIcon from '@mui/icons-material/Menu';

// Replace this with your actual wallet connection logic
const isWalletConnected = true;

const NavigationBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRouteChange = (path: string) => {
    router.push(path);
    handleCloseMenu();
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Tokenomics', path: '/tokenomics' },
    { label: 'Whitepaper', path: '/whitepaper' },
    { label: 'Roadmap', path: '/roadmap' },
    { label: 'Team', path: '/team' },
  ];

  if (isWalletConnected) {
    navItems.push({
      label: 'Control Panel',
      path: '/control',
      isControl: true, // mark for special styling
    });
  }

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: 1201, boxShadow: 'none', backgroundColor: '#222222' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box>
          <Image
            src="/coin3.png"
            alt="Logo"
            width={70}
            height={70}
            style={{ borderRadius: '50%' }}
          />
        </Box>

        {/* Desktop Links */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {navItems.map(({ label, path, isControl }) => (
            <Button
              key={path}
              onClick={() => handleRouteChange(path)}
              sx={{
                mx: 2,
                fontWeight: 'bold',
                color: isControl ? '#222222' : '#FFFFFF',
                backgroundColor: isControl ? '#34C6A3' : 'transparent',
                '&:hover': {
                  backgroundColor: isControl ? '#169976' : '#169976',
                  color: '#fff',
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Wallet & Mobile Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WalletConnectButton />
          <IconButton
            size="large"
            aria-label="menu"
            onClick={handleOpenMenu}
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 1, color: '#FFFFFF' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Mobile Menu Items */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {navItems.map(({ label, path, isControl }) => (
            <MenuItem
              key={path}
              onClick={() => handleRouteChange(path)}
              sx={{
                fontWeight: 'bold',
                color: isControl ? '#34C6A3' : 'inherit',
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
