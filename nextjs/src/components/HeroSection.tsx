'use client';

import { Box, Typography } from '@mui/material';
import theme from '../theme/theme';

const HeroSection = () => (
  <Box
    id="home"
    sx={{
      height: '100vh',
      backgroundImage: 'url(house/house.jpg)',
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
        width: { xs: '90%', lg: '70%' },
        bgcolor: theme.palette.background.default,
        color: '#FFFFFF',
        borderRadius: 2,
        p: 3,
        mt: '100px',
        opacity: 0.95,
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '1.2rem', lg: '2rem' },
        }}
      >
        Revolutionizing Real Estate Investment
      </Typography>

      {/* Intro */}
      <Typography
        variant="body1"
        sx={{ display: { xs: 'block', lg: 'none' }, mb: 3, textAlign: 'center' }}
      >
        LandLord Coin (LND) connects blockchain with affordable real estate — now focused on rebuilding Syria.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          display: { xs: 'none', lg: 'block', xl: 'none' },
          mb: 3,
          textAlign: 'center',
        }}
      >
        LandLord Coin (LND) brings DeFi to Syrian real estate—low prices today, high demand tomorrow.
      </Typography>
      <Typography
        variant="body1"
        sx={{ display: { xs: 'none', xl: 'block' }, mb: 3, textAlign: 'center' }}
      >
        LandLord Coin (LND) bridges decentralized finance with tangible real estate assets — now with a special focus on rebuilding Syria. After years of conflict, Syria presents a rare investment opportunity: property prices are extremely low, and demand is expected to surge as millions of refugees return and international sanctions begin to lift. Our mission remains unchanged — democratizing global property ownership and delivering long-term profits to everyday investors.
      </Typography>

      {/* Bullet List */}
      <Box sx={{ textAlign: 'left', mx: 'auto', width: '80%' }}>
        {/* Bullet 1 */}
        <Typography
          variant="body1"
          sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}
        >
          ✅ Secured by real estate
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', lg: 'block', xl: 'none' },
            mb: 2,
          }}
        >
          ✅ Asset‑backed security with real estate in Syria.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', xl: 'block' },
            mb: 2,
          }}
        >
          ✅ <strong>Asset‑Backed Security:</strong> Each LND token is backed by income‑generating real estate in emerging markets like Syria, giving your digital asset real-world value.
        </Typography>

        {/* Bullet 2 */}
        <Typography
          variant="body1"
          sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}
        >
          📈 Dual income
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', lg: 'block', xl: 'none' },
            mb: 2,
          }}
        >
          📈 Earn from rent and property value.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', xl: 'block' },
            mb: 2,
          }}
        >
          📈 <strong>Stable Growth:</strong> Earn two ways — from long-term property appreciation and recurring rental income paid directly to your wallet.
        </Typography>

        {/* Bullet 3 */}
        <Typography
          variant="body1"
          sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}
        >
          🌍 Global fractional ownership
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', lg: 'block', xl: 'none' },
            mb: 2,
          }}
        >
          🌍 Invest worldwide with small capital.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', xl: 'block' },
            mb: 2,
          }}
        >
          🌍 <strong>Global Access:</strong> Break traditional barriers. Start investing in properties across the world — especially in high-potential regions like Syria — with just a small amount.
        </Typography>

        {/* Bullet 4 */}
        <Typography
          variant="body1"
          sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}
        >
          🔒 On‑chain transparency
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', lg: 'block', xl: 'none' },
            mb: 2,
          }}
        >
          🔒 All deals recorded on‑chain.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', xl: 'block' },
            mb: 2,
          }}
        >
          🔒 <strong>Blockchain Transparency:</strong> All transactions are powered by smart contracts and recorded on-chain — ensuring full transparency, traceability, and trust.
        </Typography>

        {/* Bullet 5 */}
        <Typography
          variant="body1"
          sx={{ display: { xs: 'block', lg: 'none' }, mb: 0 }}
        >
          🌱 Expanding to Egypt & Turkey
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', lg: 'block', xl: 'none' },
            mb: 0,
          }}
        >
          🌱 Growth in Egypt & Turkey.
        </Typography>
        <Typography
          variant="body1"
          sx={{ display: { xs: 'none', xl: 'block' }, mb: 0 }}
        >
          🌱 <strong>Strategic Growth Ahead:</strong> Our roadmap includes expansion into high-potential emerging markets such as Egypt and Turkey — further diversifying the real estate portfolio.
        </Typography>
      </Box>

      {/* Call‑to‑Action */}
      <Typography
        variant="body1"
        sx={{
          display: { xs: 'none', lg: 'block', xl: 'none' },
          mt: 3,
          fontSize: '1rem',
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          textAlign: 'center',
        }}
      >
        Join Syria’s rebuilding—own tokenized property for real impact. 🇸🇾
      </Typography>
      <Typography
        variant="body1"
        sx={{
          display: { xs: 'none', xl: 'block' },
          mt: 3,
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          textAlign: 'center',
        }}
      >
        Be part of Syria’s rebuilding journey — tokenized real estate for a more equitable future. 🇸🇾
      </Typography>
    </Box>
  </Box>
);

export default HeroSection;
