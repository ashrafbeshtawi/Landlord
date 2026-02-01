'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import WalletConnectButton from './WalletConnectButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import PieChartIcon from '@mui/icons-material/PieChart';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import theme from '@/theme/theme';

const NavigationBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRouteChange = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Tokenomics', path: '/tokenomics', icon: <PieChartIcon /> },
    { label: 'Business Model', path: '/whitepaper', icon: <DescriptionIcon /> },
    { label: 'Invest', path: '/invest', icon: <TrendingUpIcon /> },
    { label: 'Team', path: '/team', icon: <GroupIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
    { label: 'Dashboard', path: '/control', icon: <DashboardIcon /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
          background: scrolled
            ? 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(22,33,62,0.95) 100%)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
            onClick={() => handleRouteChange('/')}
          >
            <Box
              sx={{
                position: 'relative',
                width: 50,
                height: 50,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
              }}
            >
              <Image
                src="/coin/coin3.png"
                alt="LandLord Logo"
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              LandLord
            </Typography>
          </Box>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {navItems.map(({ label, path, icon }) => (
              <Button
                key={path}
                onClick={() => handleRouteChange(path)}
                startIcon={icon}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  color: isActive(path) ? theme.palette.primary.main : 'rgba(255,255,255,0.8)',
                  background: isActive(path) ? `${theme.palette.primary.main}15` : 'transparent',
                  border: isActive(path) ? `1px solid ${theme.palette.primary.main}30` : '1px solid transparent',
                  '&:hover': {
                    background: `${theme.palette.primary.main}20`,
                    color: theme.palette.primary.main,
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: 0.5,
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Wallet & Mobile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WalletConnectButton />
            <IconButton
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: 'flex', lg: 'none' },
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}30`,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Drawer Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              >
                <Image
                  src="/coin/coin3.png"
                  alt="LandLord Logo"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                LandLord
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List sx={{ px: 0 }}>
            {navItems.map(({ label, path, icon }) => (
              <ListItem key={path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleRouteChange(path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    background: isActive(path)
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`
                      : 'transparent',
                    border: isActive(path)
                      ? `1px solid ${theme.palette.primary.main}30`
                      : '1px solid transparent',
                    '&:hover': {
                      background: `${theme.palette.primary.main}15`,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(path) ? theme.palette.primary.main : 'rgba(255,255,255,0.7)',
                      minWidth: 40,
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: isActive(path) ? 600 : 500,
                        color: isActive(path) ? theme.palette.primary.main : 'white',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavigationBar;
