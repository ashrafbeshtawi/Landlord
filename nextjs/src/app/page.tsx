"use client"

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import theme from '../theme/theme';
import HeroSection from '@/components/HeroSection';
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
        {/* Home Section */}
        <HeroSection />
        {walletConnected ? <HolderPanel /> : ''}

      </Box>
    </ThemeProvider>
  );
}
