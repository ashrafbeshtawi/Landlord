"use client"

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import theme from '../theme/theme';
import TimelineSection from '@/components/TimelineSection';
import NavigationBar from '@/components/NavigationBar';
import TokenomiksSection from '@/components/TokenomiksSection';
import WhitepaperSection from '@/components/WhitepaperSection';
import HeroSection from '@/components/HeroSection';
import TeamSection from '@/components/TeamSection';
import { useActionStore } from '@/store/store';
import HolderPanel from '@/components/HolderPanel';

export default function Home() {
  const { walletConnected } = useActionStore();
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
        {walletConnected ? <HolderPanel /> : ''}
        

        {/* Road Map Section */}
        <TimelineSection />

        {/* Tokenomiks */}
        <TokenomiksSection />

        {/* Whitepaper Section */}
        <WhitepaperSection />
        
        {/* Team Section */}
        <TeamSection />
      </Box>
    </ThemeProvider>
  );
}
