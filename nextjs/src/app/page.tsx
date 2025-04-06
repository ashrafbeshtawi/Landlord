"use client"

import * as React from 'react';
import { useState } from 'react';
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
import Image from 'next/image';

// Create a custom theme with the suggested color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#1DCD9F', // Mint Green (primary accent color)
    },
    secondary: {
      main: '#169976', // Darker Mint Green (secondary accent color)
    },
    background: {
      default: '#222222', // Dark Gray for backgrounds
      paper: '#000000', // Black background for paper elements
    },
    text: {
      primary: '#FFFFFF', // White text on dark backgrounds
      secondary: '#34C6A3', // Light mint green for secondary text
    },
    action: {
      active: '#1DCD9F', // Active button color
      hover: '#169976', // Hover color for buttons and links
    },
  },
  typography: {
    h3: {
      fontWeight: 'bold',
      color: '#FFFFFF', // White for headings
    },
    body1: {
      color: '#34C6A3', // Light mint green for body text
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
        backgroundColor: '#222222', // Dark Gray background for sections
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
        <AppBar position="fixed" sx={{ zIndex: 1201, boxShadow: 'none', backgroundColor: '#000000' }}>
          <Toolbar sx={{ padding: '15px 16px' }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
              <Image
                src="/coin.png"
                alt="Coin Logo"
                width={120}
                height={120}
                style={{ borderRadius: '50%' }}
              />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'vision', label: 'The Vision' },
                { id: 'tokenomiks', label: 'tokenomiks' },
                { id: 'whitepaper', label: 'Whitepaper' },
                { id: 'team', label: 'Our Team' },
              ].map(({ id, label }) => (
                <Button
                  key={id}
                  sx={{
                    color: '#FFFFFF', 
                    fontWeight: 'bold', 
                    mx: 2, 
                    '&:hover': { backgroundColor: '#169976' }, 
                    transition: 'background-color 0.3s',
                  }}
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
              {['home', 'vision', 'tokenomiks', 'whitepaper', 'team'].map((id) => (
                <MenuItem key={id} onClick={() => scrollToSection(id)}>
                  {id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1')}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ height: '120px' }} />

{/* Home Section with background image and text layout */}
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
            justifyContent: 'flex-start',
            pl: '10%',
          }}
        >
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default, // Using secondary color from theme
              width: '60%',
              height: 'auto',
              padding: '40px',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#FFFFFF',
              textAlign: 'center',
              marginLeft: '5%',
              transform: 'translateX(-20%)',
              opacity: 0.9,
            })}
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
          'Establishing a Tangible Asset Backing for Digital Currencies',
          `One of the major criticisms of many digital currencies is their lack of intrinsic value or tangible backing. This absence of real-world anchors often leads to high volatility and speculative trading. Backing a digital currency with physical assets, such as real estate, introduces a foundation of trust and stability. Investors are not only acquiring digital tokens, but also gaining exposure to income-generating, real-world properties. This model aligns digital finance with traditional asset management, offering a hybrid solution that is both innovative and fundamentally sound.`,
          true
        )}

        {renderSection(
          'tokenomiks',
          'Our Project: LandLord (Lnd)',
          `LandLord (Lnd) is a blockchain-based digital currency backed by income-generating real estate assets. Investors can purchase Lnd tokens, and the capital raised is used to acquire, manage, and rent out properties. Rental income is periodically distributed among token holders, thereby providing a steady return on investment. The value of Lnd is intrinsically linked to the performance of the real estate portfolio, ensuring transparency and stability. By merging the security of real estate with the flexibility of digital finance, LandLord offers a revolutionary investment model that democratizes access to the real estate market.`,
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
