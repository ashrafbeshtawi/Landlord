'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Paper, Chip, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PieChartIcon from '@mui/icons-material/PieChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import theme from '@/theme/theme';
import { CONTRACT_ADDRESS } from '@/utils/constants';

const SLIDES = [
  {
    title: 'Tokenomics',
    icon: <CheckCircleIcon />,
    color: '#4CAF50',
    points: [
      { icon: '✅', title: 'Fixed Supply', content: '100 trillion tokens minted at launch (18 decimals) — fully transparent from day one.' },
      { icon: '📈', title: 'Profit Sharing', content: 'LND holders (excluding the owner) receive periodic profit distributions based on their holdings.' },
      { icon: '🔒', title: 'Trustworthy Mechanics', content: 'Signature-based claims and protection against reentrancy ensure all distributions are safe and fair.' },
      { icon: '🔥', title: 'Burnable Tokens', content: 'Any holder can reduce the total supply by burning tokens — helping increase scarcity.' },
      { icon: '🏠', title: 'Controlled Minting', content: 'New tokens can only be minted up to 10% of supply, strictly for real estate acquisitions.' },
    ],
  },
  {
    title: "What's Not in the Contract",
    icon: <BlockIcon />,
    color: '#FF5722',
    points: [
      { icon: '🚫', title: 'No Transfer Restrictions', content: 'Tokens can be freely bought, held, and sold — no mechanisms block access to your assets.' },
      { icon: '🚫', title: 'No Transaction Fees', content: 'Transfers happen 1:1 — there are no built-in taxes or fees on send, receive, or trade.' },
      { icon: '🚫', title: 'No Blacklisting', content: 'No functions allow addresses to be blocked or given unfair priority — everyone is equal.' },
      { icon: '🚫', title: 'No Wallet Limits', content: 'No artificial caps on how much you can hold or move — promoting free participation.' },
      { icon: '🚫', title: 'No Complex Gimmicks', content: 'No reflections, auto-liquidity, or rebasing — built for clarity and simplicity.' },
    ],
  },
];

const CONTRACT_CODE_URL = `https://bscscan.com/address/${CONTRACT_ADDRESS}#code`;

export default function TokenomiksSection() {
  const [[index, direction], setIndex] = useState([0, 0]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paginate = (newDirection: number) => {
    setIndex(([prev]) => {
      const nextIndex = (prev + newDirection + SLIDES.length) % SLIDES.length;
      return [nextIndex, newDirection];
    });
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => paginate(1), 10000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  const currentSlide = SLIDES[index];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <Box
      id="tokenomiks"
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: 'auto', width: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, #4CAF50)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <PieChartIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.8rem' },
              }}
            >
              Tokenomics
            </Typography>
          </Box>
        </motion.div>

        {/* Slide Content */}
        <Box sx={{ position: 'relative', minHeight: 500 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Slide Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: `${currentSlide.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentSlide.color,
                    }}
                  >
                    {currentSlide.icon}
                  </Box>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                    {currentSlide.title}
                  </Typography>
                </Box>

                {/* Points */}
                <Grid container spacing={2}>
                  {currentSlide.points.map((point, i) => (
                    <Grid key={i} size={12}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-start',
                          }}
                        >
                          <Typography sx={{ fontSize: '1.5rem' }}>{point.icon}</Typography>
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 0.5 }}>
                              {point.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                              {point.content}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* CTA Button */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<CodeIcon />}
                    onClick={() => window.open(CONTRACT_CODE_URL, '_blank')}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      },
                    }}
                  >
                    View Source Code
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <IconButton
            onClick={() => paginate(-1)}
            sx={{
              position: 'absolute',
              left: { xs: -5, md: -60 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => paginate(1)}
            sx={{
              position: 'absolute',
              right: { xs: -5, md: -60 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Navigation Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
          {SLIDES.map((_, i) => (
            <Chip
              key={i}
              size="small"
              onClick={() => setIndex([i, i > index ? 1 : -1])}
              sx={{
                width: i === index ? 32 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor: i === index ? theme.palette.primary.main : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: i === index ? theme.palette.primary.main : 'rgba(255,255,255,0.3)' },
                '& .MuiChip-label': { display: 'none' },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
