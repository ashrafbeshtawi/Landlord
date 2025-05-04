'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Image from 'next/image';
import WalletConnectButton from './WalletConnectButton';

const NavigationBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, boxShadow: 'none', backgroundColor: '#222' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Image src="/coin3.png" alt="Logo" width={70} height={70} style={{ borderRadius: '50%' }} />
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {['home', 'roadmap', 'tokenomiks', 'whitepaper', 'team'].map(id => (
            <Button
              key={id}
              sx={{ color: '#fff', mx: 2, fontWeight: 'bold', '&:hover': { backgroundColor: '#169976' } }}
              onClick={() => scrollToSection(id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WalletConnectButton />
          <Button
            variant="contained"
            color="primary"
            sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}
          >
            Connect Wallet
          </Button>
          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, ml: 1, backgroundColor: '#169976' }}>
            <WalletIcon sx={{ color: '#fff' }} />
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: { xs: 'flex', md: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {['home', 'roadmap', 'tokenomiks', 'whitepaper', 'team'].map(id => (
            <MenuItem key={id} onClick={() => scrollToSection(id)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
