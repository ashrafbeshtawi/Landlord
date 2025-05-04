"use client"

import * as React from 'react';
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import theme from '../theme/theme'; // Import your theme
import TimelineSection from '../components/TimelineSection'; // Import your timeline section component
import NavigationBar from '../components/NavigationBar';
import TokenomiksSection from '@/components/TokenomiksSection';

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
        <NavigationBar />


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
        <TimelineSection />



        {/* Tokenomiks */}
        <TokenomiksSection />

        {/* Team Section */}

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
