'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import theme from '@/theme/theme';

const CONTRACT_CODE_URL = 'https://bscscan.com/address/0xYourSmartContractAddressHere#code';

const slides = [
  {
    title: 'Tokenomics',
    gradient: 'linear-gradient(45deg, #ffffff, #90caf9)',
    points: [
      ['✅ Fixed Supply', '100 trillion tokens minted at launch (18 decimals) — fully transparent from day one.'],
      ['📈 Profit Sharing', 'LND holders (excluding the owner) receive periodic profit distributions based on their holdings — secured and verifiable.'],
      ['🔒 Trustworthy Mechanics', 'Signature-based claims and protection against reentrancy ensure all distributions are safe, fair, and technically sound.'],
      ['🔥 Burnable Tokens', 'Any holder can reduce the total supply by burning tokens — helping to increase scarcity and long-term value.'],
      ['🏠 Controlled Minting', 'New tokens can only be minted by the owner and only up to 10% of the existing supply, strictly for real estate acquisitions — ensuring real utility and responsible expansion.']
    ],
    footer: 'LandLord is more than just a token — it is a real-value distribution system designed for the future of decentralized property ownership and income sharing.'
  },
  {
    title: 'What’s Not in the Contract',
    gradient: 'linear-gradient(45deg, #ffffff, #f48fb1)',
    points: [
      ['🚫 No Transfer Restrictions', 'Tokens can be freely bought, held, and sold — there are no mechanisms that block users from accessing their assets.'],
      ['🚫 No Transaction Fees or Hidden Deductions', 'Transfers happen 1:1 — there are no built-in taxes or fees applied to send, receive, or trade.'],
      ['🚫 No Blacklisting or Special Privileges', 'The contract contains no functions that allow addresses to be blocked or given unfair priority — everyone is treated equally.'],
      ['🚫 No Wallet or Transaction Limits', 'There are no artificial caps on how much you can hold or move — promoting free, open participation.'],
      ['🚫 No Complex Tokenomics Gimmicks', 'The token does not rely on reflections, auto-liquidity, or rebasing mechanics — it is built for clarity, simplicity, and long-term reliability.']
    ]
  }
];

const glassStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(25px)',
  borderRadius: 5,
  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  color: 'white',
  maxWidth: '900px',
  width: '100%',
  mx: 'auto',
  px: { xs: 3, md: 6 },
  py: { xs: 4, md: 6 },
  minHeight: '620px',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

// Animation for horizontal sliding
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6
        }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      duration: 0.6,
    }
  })
};

const TokenomiksSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => paginate(1), 8000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index]);

  return (
    <Box
      id="tokenomiks"
      sx={{
        py: { xs: 10, md: 16 },
        px: 2,
        backgroundImage: `url('/house/house.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0e1a1a',
        position: 'relative'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => paginate(-1)}
          sx={{
            position: 'absolute',
            top: '50%',
            left: -10,
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.4)',
            zIndex: 10,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={() => paginate(1)}
          sx={{
            position: 'absolute',
            top: '50%',
            right: -10,
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.4)',
            zIndex: 10,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Box sx={glassStyle}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3,
                    textAlign: 'center',
                    background: slides[index].gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '2.8rem' }
                  }}
                >
                  {slides[index].title}
                </Typography>

                {slides[index].points.map(([title, content], i) => (
                  <Box key={i} sx={{ mt: i === 0 ? 0 : 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>{title}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', pl: 1 }}>{content}</Typography>
                  </Box>
                ))}

                {slides[index].footer && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 4, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}
                  >
                    {slides[index].footer}
                  </Typography>
                )}
              </Box>

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={() => window.open(CONTRACT_CODE_URL, '_blank')}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#388E3C' }
                  }}
                >
                  View Source Code
                </Button>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default TokenomiksSection;
