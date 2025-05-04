"use client"

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import theme from '../theme/theme'; // Import your theme
import TimelineSection from '@/components/TimelineSection';
import NavigationBar from '@/components/NavigationBar';
import TokenomiksSection from '@/components/TokenomiksSection';
import WhitepaperSection from '@/components/WhitepaperSection';
import HeroSection from '@/components/HeroSection';

export default function Home() {

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
        <HeroSection />

        {/* Road Map Section */}
        <TimelineSection />

        {/* Tokenomiks */}
        <TokenomiksSection />

        {/* Team Section */}

        {/* Whitepaper Section */}
         <WhitepaperSection />
      </Box>
    </ThemeProvider>
  );
}
