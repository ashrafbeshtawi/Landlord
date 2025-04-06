"use client";

import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Create a custom theme with the suggested color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A237E', // Deep blue
    },
    secondary: {
      main: '#00ACC1', // Cyan
    },
    error: {
      main: '#FFC107', // Amber
    },
    background: {
      default: '#F5F5F5', // Light background color
    },
    text: {
      primary: '#212121', // Dark primary text
      secondary: '#757575', // Secondary text
    },
  },
  typography: {
    h3: {
      fontWeight: 'bold',
      color: '#212121',
    },
    body1: {
      color: '#757575',
    },
  },
});

export default function Home() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    handleCloseMenu();
  };

  const renderSection = (
    id: string,
    title: string,
    description: string,
    reverse: boolean = false
  ) => (
    <Box
      id={id}
      sx={{
        height: '100vh',
        p: 4,
        backgroundColor: reverse ? '#e0e0e0' : '#f5f5f5',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {reverse ? (
        <>
          <Box sx={{ flex: 1, p: 2, display: 'flex', justifyContent: 'center' }}>
            <Image src="/coin.png" alt={title} width={300} height={300} />
          </Box>
          <Box sx={{ flex: 1, p: 2 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ flex: 1, p: 2 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, display: 'flex', justifyContent: 'center' }}>
            <Image src="/coin.png" alt={title} width={300} height={300} />
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <div style={{ margin: 0, padding: 0 }}>
        {/* Fixed Navigation AppBar */}
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar disableGutters sx={{ px: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
              <Image
                src="/coin.png"
                alt="Coin Logo"
                width={120}
                height={100}
                style={{ borderRadius: '50%' }}
              />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'vision', label: 'The Vision' },
                { id: 'tokonomiks', label: 'Tokonomiks' },
                { id: 'whitepaper', label: 'Whitepaper' },
                { id: 'team', label: 'Our Team' },
              ].map(({ id, label }) => (
                <Button
                  key={id}
                  sx={{ color: 'white', fontWeight: 'bold', mx: 2 }}
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </Button>
              ))}
            </Box>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenMenu}
              color="inherit"
              sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {['home', 'vision', 'tokonomiks', 'whitepaper', 'team'].map((id) => (
                <MenuItem key={id} onClick={() => scrollToSection(id)}>
                  {id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1')}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ height: '120px' }} />

        {/* Home Section with partial left overlay */}
        <Box
          id="home"
          sx={{
            height: '100vh',
            position: 'relative',
            backgroundImage: 'url(/house.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 255, 0.3)', // Blue overlay
              width: { xs: '100%', md: '50%' },
              height: '100%',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Typography variant="h3" sx={{ mb: 2 }}>
              Welcome to Land Lord Coin
            </Typography>
            <Typography variant="body1">
              Invest in real estate. Empower your future. Discover the decentralized way to build property wealth.
            </Typography>
          </Box>
        </Box>

        {renderSection(
          'vision',
          'The Vision Section',
          'This section describes our vision. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          true
        )}
        {renderSection(
          'tokonomiks',
          'Tokonomiks Section',
          'Here we detail the tokonomiks. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
          false
        )}
        {renderSection(
          'whitepaper',
          'Whitepaper Section',
          'The whitepaper contains in-depth information. Duis aute irure dolor in reprehenderit.',
          true
        )}
        {renderSection(
          'team',
          'Our Team Section',
          'Meet our team! Excepteur sint occaecat cupidatat non proident.',
          false
        )}
      </div>
    </ThemeProvider>
  );
}
