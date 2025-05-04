'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import Image from 'next/image';
import WalletConnectButton from './WalletConnectButton';
import MenuIcon from '@mui/icons-material/Menu';

const NavigationBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    handleCloseMenu();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, boxShadow: 'none', backgroundColor: '#222222' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box>
          <Image src="/coin3.png" alt="Logo" width={70} height={70} style={{ borderRadius: '50%' }} />
        </Box>

        {/* Desktop Links */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {['home', 'roadmap', 'tokenomiks', 'whitepaper', 'team'].map(id => (
            <Button
              key={id}
              sx={{ color: '#FFFFFF', mx: 2, fontWeight: 'bold', '&:hover': { backgroundColor: '#169976' } }}
              onClick={() => scrollToSection(id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </Button>
          ))}
        </Box>

        {/* Wallet & Mobile Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WalletConnectButton />
          {/* Hamburger on small screens only */}
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