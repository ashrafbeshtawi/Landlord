'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '@/theme/theme';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const SLIDES = [
  {
    title: 'Tokenomics',
    points: [
      ['✅ Fixed Supply', '100 trillion tokens minted at launch (18 decimals) — fully transparent from day one.'],
      ['📈 Profit Sharing', 'LND holders (excluding the owner) receive periodic profit distributions based on their holdings — secured and verifiable.'],
      ['🔒 Trustworthy Mechanics', 'Signature-based claims and protection against reentrancy ensure all distributions are safe, fair, and technically sound.'],
      ['🔥 Burnable Tokens', 'Any holder can reduce the total supply by burning tokens — helping to increase scarcity and long-term value.'],
      ['🏠 Controlled Minting', 'New tokens can only be minted by the owner and only up to 10% of the existing supply, strictly for real estate acquisitions — ensuring real utility and responsible expansion.']
    ],
    footer: '',
  },
  {
    title: 'What’s Not in the Contract By Design',
    points: [
      ['🚫 No Transfer Restrictions', 'Tokens can be freely bought, held, and sold — there are no mechanisms that block users from accessing their assets.'],
      ['🚫 No Transaction Fees or Hidden Deductions', 'Transfers happen 1:1 — there are no built-in taxes or fees applied to send, receive, or trade.'],
      ['🚫 No Blacklisting or Special Privileges', 'The contract contains no functions that allow addresses to be blocked or given unfair priority — everyone is treated equally.'],
      ['🚫 No Wallet or Transaction Limits', 'There are no artificial caps on how much you can hold or move — promoting free, open participation.'],
      ['🚫 No Complex Tokenomics Gimmicks', 'The token does not rely on reflections, auto-liquidity, or rebasing mechanics — it is built for clarity, simplicity.']
    ],
    footer: '',
  }
];

const glassBoxStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(25px)',
  borderRadius: 5,
  p: { xs: 3, md: 5 },
  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  color: 'white',
  width: '100%',
  maxWidth: 800,
  minHeight: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute'
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative'
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute'
  }),
};

const TokenomiksSection = () => {
  const [[index, direction], setIndex] = useState([0, 0]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = (newDirection: number) => {
    setIndex(([prev]) => {
      const nextIndex = (prev + newDirection + SLIDES.length) % SLIDES.length;
      return [nextIndex, newDirection];
    });
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => paginate(1), 8000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  const currentSlide = SLIDES[index];

  return (
    <Box
      id="tokenomiks"
      sx={{
        position: 'relative',
        backgroundImage: 'url(/house/house.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        px: { xs: 2, md: 4 },
        py: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1
        }
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6 }}
          style={{ zIndex: 2 }}
        >
          <Box sx={glassBoxStyle}>
            <Box>
              <Typography variant="h4" textAlign="center" sx={{ color: theme.palette.text.primary, mb: 3 }}>
                {currentSlide.title}
              </Typography>
              {currentSlide.points.map(([title, content], i) => (
                <Box key={i} sx={{ mt: i === 0 ? 0 : 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" sx={{ pl: 1, color: 'rgba(255,255,255,0.85)' }}>
                    {content}
                  </Typography>
                </Box>
              ))}
              {currentSlide.footer && (
                <Typography variant="body2" sx={{ mt: 3, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                  {currentSlide.footer}
                </Typography>
              )}
            </Box>

            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                onClick={() => window.open('https://bscscan.com/address/0xYourSmartContractAddressHere#code', '_blank')}
              >
                View Source Code
              </Button>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Box sx={{ position: 'absolute', top: '50%', left: 20, zIndex: 3 }}>
        <IconButton onClick={() => paginate(-1)} sx={{ color: theme.palette.primary.main }}>
          <ChevronLeft />
        </IconButton>
      </Box>
      <Box sx={{ position: 'absolute', top: '50%', right: 20, zIndex: 3 }}>
        <IconButton onClick={() => paginate(1)} sx={{ color: theme.palette.primary.main }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Navigation Dots */}
      <Box sx={{ position: 'absolute', bottom: 32, display: 'flex', gap: 1, zIndex: 3 }}>
        {SLIDES.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex([i, i > index ? 1 : -1])}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: i === index ? theme.palette.primary.main : 'rgba(255,255,255,0.3)',
              cursor: 'pointer'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TokenomiksSection;
