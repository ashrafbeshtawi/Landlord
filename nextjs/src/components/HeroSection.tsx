'use client';

import { Box, Typography } from '@mui/material';
import theme from '../theme/theme'; // Import your theme

const HeroSection = () => (
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

      <Typography
        variant="body1"
        sx={{ display: { xs: 'block', md: 'none' }, mb: 3, textAlign: 'center' }}
      >
        LandLord Coin (LND) connects blockchain with affordable real estate — now focused on rebuilding Syria. Invest in a country on the rise as it recovers and rebuilds.
      </Typography>
      <Typography
        variant="body1"
        sx={{ display: { xs: 'none', md: 'block' }, mb: 3, textAlign: 'center' }}
      >
        LandLord Coin (LND) bridges decentralized finance with tangible real estate assets — now with a special focus on rebuilding Syria. After years of conflict, Syria presents a rare investment opportunity: property prices are extremely low, and demand is expected to surge as millions of refugees return and international sanctions begin to lift. Our mission remains unchanged — democratizing global property ownership and delivering long-term profits to everyday investors.
      </Typography>

      <Box sx={{ textAlign: 'left', mx: 'auto', width: '80%' }}>
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
          ✅ <strong>Asset‑Backed Security:</strong> Each LND token is backed by income‑generating real estate in emerging markets like Syria, giving your digital asset real-world value.
        </Typography>

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
          📈 <strong>Stable Growth:</strong> Earn two ways — from long-term property appreciation and recurring rental income paid directly to your wallet.
        </Typography>

        <Typography
          variant="body1"
          sx={{ display: { xs: 'block', md: 'none' }, mb: 2, fontSize: 'inherit' }}
        >
          🌍 Global fractional ownership
        </Typography>
        <Typography
          variant="body1"
          sx={{ display: { xs: 'none', md: 'block' }, mb: 2, fontSize: 'inherit' }}
        >
          🌍 <strong>Global Access:</strong> Break traditional barriers. Start investing in properties across the world — especially in high-potential regions like Syria — with just a small amount.
        </Typography>

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
          🔒 <strong>Blockchain Transparency:</strong> All transactions are powered by smart contracts and recorded on-chain — ensuring full transparency, traceability, and trust.
        </Typography>

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
          🚀 <strong>Future‑Proof Investment:</strong> Traditional real estate is slow and costly. With LND, it's quick, low-cost, and accessible to anyone — anywhere.
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{ mt: 3, fontSize: { xs: '0.7rem', md: '1.2rem' }, fontWeight: 'bold', color: theme.palette.primary.main, textAlign: 'center' }}
      >
        Be part of Syria’s rebuilding journey — tokenized real estate for a more equitable future.
      </Typography>
    </Box>
  </Box>
);

export default HeroSection;
