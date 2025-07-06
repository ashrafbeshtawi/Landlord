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
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Image from 'next/image';
import WalletConnectButton from './WalletConnectButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PieChartIcon from '@mui/icons-material/PieChart';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import theme from '@/theme/theme';

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
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Tokenomics', path: '/tokenomics', icon: <PieChartIcon /> },
    { label: 'Business Model', path: '/whitepaper', icon: <DescriptionIcon /> },
    { label: 'Become Investor', path: '/invest', icon: <TrendingUpIcon /> },
    { label: 'Team', path: '/team', icon: <GroupIcon /> },
    { label: 'Contact Us', path: '/contact', icon: <ContactMailIcon /> },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: 1201, boxShadow: 'none', backgroundColor: '#222222' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box>
          <Image
            src="/coin/coin3.png"
            alt="Logo"
            width={70}
            height={70}
            style={{ borderRadius: '50%' }}
          />
        </Box>

        {/* Desktop Links */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {navItems.map(({ label, path, icon }) => (
            <Button
              key={path}
              onClick={() => handleRouteChange(path)}
              variant="text"
              startIcon={icon}
              sx={{
                mx: 2,
                fontWeight: 'bold',
                '&:hover': { backgroundColor: theme.palette.primary.main },
                color: '#FFFFFF',
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
          {navItems.map(({ label, path, icon }) => (
            <MenuItem
              key={path}
              onClick={() => handleRouteChange(path)}
              sx={{ fontWeight: 'bold', color: 'inherit' }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
