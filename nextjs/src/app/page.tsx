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

// Import MUI lab components for the timeline
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';

import HouseIcon from '@mui/icons-material/House';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CodeIcon from '@mui/icons-material/Code';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CampaignIcon from '@mui/icons-material/Campaign';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1DCD9F',
    },
    secondary: {
      main: '#169976',
    },
    background: {
      default: '#222222',
      paper: '#000000',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#34C6A3',
    },
    action: {
      active: '#1DCD9F',
      hover: '#169976',
    },
  },
  typography: {
    h3: {
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontSize: '2.5rem',
    },
    body1: {
      color: '#34C6A3',
      fontSize: '1.2rem',
    },
  },
});

function CustomizedTimeline() {
  // Style for the vertical connecting lines
  const connectorStyle = {
    minHeight: '50px', // Increased height for more spacing
    bgcolor: '#00BFA5', // Matching the teal color from your image
  };



  // Style for the timeline dots
  const timelineDotStyle = {
    bgcolor: '#00BFA5', // Teal background
    boxShadow: '0 0 30px rgba(0, 191, 165, 0.5)', // Glow effect
  };

  return (
    <Box sx={{ 
      color: theme.palette.primary.main,
      borderRadius: 3,
      width: { xs: '90%', md: '60%' },
    }}>


      <Timeline position="right">
        {/* 2023: Analyzing the real estate market */}
        <TimelineItem>
          <TimelineOppositeContent 
            variant="body1" 
            color="inherit"
          >
            <Typography variant="h6">2023</Typography>
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot sx={timelineDotStyle}>
              <HouseIcon sx={{ color: 'black' }} />
            </TimelineDot>
            <TimelineConnector sx={connectorStyle} />
          </TimelineSeparator>

          <TimelineContent >
            <Typography variant="h6" component="span">
              Analyzing the real estate market
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* 2024: Finding best location in emerging markets */}
        <TimelineItem>
          <TimelineOppositeContent 
            
            variant="body1" 
            color="inherit"
          >
            <Typography variant="h6">2024</Typography>
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot sx={timelineDotStyle}>
              <LocationOnIcon sx={{ color: 'black' }} />
            </TimelineDot>
            <TimelineConnector sx={connectorStyle} />
          </TimelineSeparator>

          <TimelineContent >
            <Typography variant="h6" component="span">
              Finding best location in emerging markets
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* 2025: Building & Testing Blockchain code */}
        <TimelineItem>
          <TimelineOppositeContent 
            
            variant="body1" 
            color="inherit"
          >
            <Typography variant="h6"> April 2025</Typography>
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot sx={timelineDotStyle}>
              <CodeIcon sx={{ color: 'black' }} />
            </TimelineDot>
            <TimelineConnector sx={connectorStyle} />
          </TimelineSeparator>

          <TimelineContent >
            <Typography variant="h6" component="span">
              Building & Testing Blockchain code
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* May 2025: Fund Run */}
        <TimelineItem>
          <TimelineOppositeContent 
            
            variant="body1" 
            color="inherit"
          >
            <Typography variant="h6">May 2025</Typography>
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot sx={timelineDotStyle}>
              <MonetizationOnIcon sx={{ color: 'black' }} />
            </TimelineDot>
            <TimelineConnector sx={connectorStyle} />
          </TimelineSeparator>

          <TimelineContent >
            <Typography variant="h6" component="span">
              Fund Run
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* June 2025: Coin Listing & Social Media Marketing */}
        <TimelineItem>
          <TimelineOppositeContent 
            
            variant="body1" 
            color="inherit"
          >
            <Typography variant="h6">Jun 2025</Typography>
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot sx={timelineDotStyle}>
              <CampaignIcon sx={{ color: 'black' }} />
            </TimelineDot>
            <TimelineConnector sx={connectorStyle} />
          </TimelineSeparator>

          <TimelineContent >
            <Typography variant="h6" component="span">
              Coin Listing & Social Media Marketing
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* July 2025: First property purchase */}
        <TimelineItem>
          <TimelineOppositeContent 
            
            variant="body1" 
            color="inherit"
          >
            <Typography variant="h6">Jul 2025</Typography>
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot sx={timelineDotStyle}>
              <ApartmentIcon sx={{ color: 'black' }} />
            </TimelineDot>
            <TimelineConnector sx={connectorStyle} />
          </TimelineSeparator>

          <TimelineContent >
            <Typography variant="h6" component="span">
              First property purchase
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* First rent distribution End of 2025 */}
        <TimelineItem>
          <TimelineOppositeContent 
            
            variant="body1" 
            color="inherit"
          >
            <Typography variant="h6">Dec 2025</Typography>
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot sx={timelineDotStyle}>
              <ApartmentIcon sx={{ color: 'black' }} />
            </TimelineDot>
            <TimelineConnector sx={connectorStyle} />

          </TimelineSeparator>

          <TimelineContent >
            <Typography variant="h6" component="span">
              First Rent Distribution on coin holders
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {/* New plans */}
         <TimelineItem>
          <TimelineOppositeContent 
            
            variant="body1" 
            color="inherit"
          >
            <Typography variant="h6">2026</Typography>
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot sx={timelineDotStyle}>
              <HourglassBottomIcon sx={{ color: 'black' }} />
            </TimelineDot>
          </TimelineSeparator>

          <TimelineContent >
            <Typography variant="h6" component="span">
              Coming Soon
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Box>
  );
}



export default function Home() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);;

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
    <ThemeProvider theme={theme}>
      <Box
        className= 'gradient-background'
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Fixed Navigation AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: 1201, boxShadow: 'none', backgroundColor: theme.palette.background.default }}
        >
          <Toolbar>
            <Box sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }}>
              <Image
                src="/coin3.png"
                alt="Coin Logo"
                width={70}
                height={70}
                style={{ borderRadius: '50%' }}
              />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'roadmap', label: 'Road Map' },
                { id: 'tokenomiks', label: 'tokenomiks' },
                { id: 'whitepaper', label: 'Whitepaper' },
                { id: 'team', label: 'Our Team' },
              ].map(({ id, label }) => (
                <Button
                  key={id}
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    mx: { xs: 1, md: 2 },
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
              color="primary"
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
              {['home', 'roadmap', 'tokenomiks', 'whitepaper', 'team'].map((id) => (
                <MenuItem key={id} onClick={() => scrollToSection(id)}>
                  {id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1')}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>


        {/* Home Section */}
        <Box
          id="home"
          sx={{
            height: '100vh',
            backgroundImage: 'url(/house.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: { xs: '90%', md: '60%' },
              bgcolor: theme.palette.background.default,
              color: '#FFFFFF',
              borderRadius: 2,
              p: 3,
              mt: '100px',
              opacity: 0.95,
            }}
          >
            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', fontSize: { xs: '1.2rem', md: '2rem' } }}>
              Revolutionizing Real Estate Investment
            </Typography>

            {/* Short vs. Full Welcome Text */}
            <Typography
              variant="body1"
              sx={{ display: { xs: 'block', md: 'none' }, mb: 3, textAlign: 'center' }}
            >
              Welcome to the future of real estate — LandLord Coin (LND) connects blockchain with real-world property, making global ownership and profits accessible to everyone.
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: { xs: 'none', md: 'block' }, mb: 3, textAlign: 'center' }}
            >
              Welcome to the future of property ownership — where blockchain technology meets tangible real estate assets. LandLord Coin (LND) is creating a bridge between decentralized finance and real-world investment opportunities, giving everyday people the chance to own, profit from, and participate in the global real estate market like never before.
            </Typography>

            <Box sx={{ textAlign: 'left', mx: 'auto', width: '80%' }}>
              {/* Asset‑Backed Security */}
              <Typography
                variant="body1"
                sx={{ display: { xs: 'block', md: 'none' }, mb: 2, fontSize: 'inherit' }}
              >
                ✅ Secured by real estate
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: { xs: 'none', md: 'block' }, mb: 2, fontSize: 'inherit' }}
              >
                ✅ <strong>Asset‑Backed Security:</strong> Each LND token is secured by income‑generating real estate in high‑demand areas, ensuring your digital asset reflects real‑world value.
              </Typography>

              {/* Stable Growth */}
              <Typography
                variant="body1"
                sx={{ display: { xs: 'block', md: 'none' }, mb: 2, fontSize: 'inherit' }}
              >
                📈 Dual income streams
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: { xs: 'none', md: 'block' }, mb: 2, fontSize: 'inherit' }}
              >
                📈 <strong>Stable Growth:</strong> Enjoy dual income streams — benefit from property value appreciation over time and receive regular rental income distributions directly to your wallet.
              </Typography>

              {/* Global Access */}
              <Typography
                variant="body1"
                sx={{ display: { xs: 'block', md: 'none' }, mb: 2, fontSize: 'inherit' }}
              >
                🌍 Fractional global assets
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: { xs: 'none', md: 'block' }, mb: 2, fontSize: 'inherit' }}
              >
                🌍 <strong>Global Access:</strong> Break the barriers of traditional property investing. With LandLord Coin, you can own a fraction of premium real estate anywhere in the world, starting with just a small investment.
              </Typography>

              {/* Blockchain Transparency */}
              <Typography
                variant="body1"
                sx={{ display: { xs: 'block', md: 'none' }, mb: 2, fontSize: 'inherit' }}
              >
                🔒 Smart contract auditability
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: { xs: 'none', md: 'block' }, mb: 2, fontSize: 'inherit' }}
              >
                🔒 <strong>Blockchain Transparency:</strong> All transactions are regulated by smart contracts and recorded on the blockchain. This guarantees full auditability, eliminating fraud and ensuring fair treatment for all stakeholders.
              </Typography>

              {/* Future‑Proof Investment */}
              <Typography
                variant="body1"
                sx={{ display: { xs: 'block', md: 'none' }, mb: 0, fontSize: 'inherit' }}
              >
                🚀 Fast, affordable, accessible
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: { xs: 'none', md: 'block' }, mb: 0, fontSize: 'inherit' }}
              >
                🚀 <strong>Future‑Proof Investment:</strong> Traditional property investment is slow, expensive, and exclusive. With LND, we make it fast, affordable, and accessible to anyone — regardless of geography or financial status.
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{ mt: 3, fontSize: { xs: '0.7rem', md: '1.2rem' }, fontWeight: 'bold', color: theme.palette.primary.main, textAlign: 'center' }}
            >
              Join the $2.5 trillion real estate market revolution – Democratized, Decentralized, and Yours to Control
            </Typography>
          </Box>
        </Box>

        {/* Road Map Section */}
        <Box
          id="roadmap"
          sx={{
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            }}
        >
          <Typography variant="h3" sx={{ mb: 4, marginTop: '100px', }}>
            Road Map
          </Typography>
          <CustomizedTimeline />
        </Box>


        {/* Tokenomiks */}
        <Box
          id="tokenomiks"
          sx={{
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: { xs: '90%', md: '60%' },
              color: theme.palette.primary.main,
              borderRadius: 2,
              p: 3,
              marginTop: '100px',
              opacity: 0.95,
            }}
          >
           <Typography variant="h3" sx={{ mb: 3, textAlign: 'center' }}>
            Tokenomics
          </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              LandLord (LND) is a utility token designed for a real
              estate-backed ecosystem — with built-in profit sharing and a
              carefully controlled token supply.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              ✅ Fixed Supply:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              100 trillion tokens minted at launch (18 decimals) — fully
              transparent from day one.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              📈 Profit Sharing:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              LND holders (excluding the owner) receive periodic profit
              distributions based on their holdings — secured and verifiable.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              🔒 Trustworthy Mechanics:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              Signature-based claims and protection against reentrancy ensure all
              distributions are safe, fair, and technically sound.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              🔥 Burnable Tokens:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              Any holder can reduce the total supply by burning tokens — helping
              to increase scarcity and long-term value.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              🏠 Controlled Minting:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              New tokens can only be minted by the owner and only up to 10% of
              the existing supply, strictly for real estate acquisitions —
              ensuring real utility and responsible expansion.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, mt: 2 }}>
              LandLord is more than just a token — its a real-value
              distribution system designed for the future of decentralized
              property ownership and income sharing.
            </Typography>
          </Box>
        </Box>

        <Box
          id="tokenomiks2"
          sx={{
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ mb: 4, marginTop: '100px' }}>
            What’s Not in the Contract — By Design
          </Typography>
          <Box
            sx={{
              width: { xs: '90%', md: '60%' },
              color: theme.palette.primary.main,
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              To build trust and fairness into the system, LandLordToken
              intentionally avoids features that can be misused or create
              imbalance:
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              🚫 No Transfer Restrictions:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              Tokens can be freely bought, held, and sold — there are no
              mechanisms that block users from accessing their assets.
            </Typography>
            
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              🚫 No Transaction Fees or Hidden Deductions:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              Transfers happen 1:1 — there are no built-in taxes or fees
              applied to send, receive, or trade.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              🚫 No Blacklisting or Special Privileges:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              The contract contains no functions that allow addresses to be
              blocked or given unfair priority — everyone is treated equally.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              🚫 No Wallet or Transaction Limits:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              There are no artificial caps on how much you can hold or move —
              promoting free, open participation.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
            >
              🚫 No Complex Tokenomics Gimmicks:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
              The token does not rely on reflections, auto-liquidity, or
              rebasing mechanics — its built for clarity, simplicity, and
              long-term reliability.
            </Typography>
          </Box>
        </Box>

        {/* Whitepaper Section */}
        <Box
          id="whitepaper"
          sx={{
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ mb: 2, marginTop: '100px', color: '#FFFFFF' }}>
            Whitepaper
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: '#34C6A3', width: { xs: '90%', md: '60%' }, textAlign: 'center' }}>
            Our comprehensive whitepaper provides in-depth details on the LandLord Coin vision, tokenomics, technical architecture, and roadmap. Explore the full documentation to understand our project’s foundation and future plans.
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
            onClick={() => window.open('/whitepaper.pdf', '_blank')}
          >
            <strong>Download Whitepaper</strong>
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
