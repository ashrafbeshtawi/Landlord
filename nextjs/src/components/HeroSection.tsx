'use client';

import { Box, Typography } from '@mui/material';

const HeroSection = () => (
  <Box
    id="home"
    sx={{
      height: '100vh',
      backgroundImage: 'url(/house.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      pt: '100px',
      px: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        width: { xs: '90%', md: '60%' },
        backgroundColor: '#222',
        color: '#fff',
        borderRadius: 2,
        p: 3,
        opacity: 0.95,
      }}
    >
      <Typography variant="h3" align="center" gutterBottom>
        Revolutionizing Real Estate Investment
      </Typography>
      <Typography variant="body1" align="center">
        Welcome to the future of property ownership — where blockchain meets real estate.
      </Typography>
    </Box>
  </Box>
);

export default HeroSection;
