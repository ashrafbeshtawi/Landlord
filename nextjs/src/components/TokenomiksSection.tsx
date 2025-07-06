'use client';

import { useEffect, useState, useRef } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const fadeInOut = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.8 } }
};

const glassBoxStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(25px)',
  borderRadius: 5,
  p: { xs: 3, md: 5 },
  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  color: 'white',
  maxWidth: '900px',
  mx: 'auto',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative'
};

const tokenomicsContent = [
  ['✅ Fixed Supply', '100 trillion tokens minted at launch (18 decimals) — fully transparent from day one.'],
  ['📈 Profit Sharing', 'LND holders (excluding the owner) receive periodic profit distributions based on their holdings — secured and verifiable.'],
  ['🔒 Trustworthy Mechanics', 'Signature-based claims and protection against reentrancy ensure all distributions are safe, fair, and technically sound.'],
  ['🔥 Burnable Tokens', 'Any holder can reduce the total supply by burning tokens — helping to increase scarcity and long-term value.'],
  ['🏠 Controlled Minting', 'New tokens can only be minted by the owner and only up to 10% of the existing supply, strictly for real estate acquisitions — ensuring real utility and responsible expansion.']
];

const notInContractContent = [
  ['🚫 No Transfer Restrictions', 'Tokens can be freely bought, held, and sold — there are no mechanisms that block users from accessing their assets.'],
  ['🚫 No Transaction Fees or Hidden Deductions', 'Transfers happen 1:1 — there are no built-in taxes or fees applied to send, receive, or trade.'],
  ['🚫 No Blacklisting or Special Privileges', 'The contract contains no functions that allow addresses to be blocked or given unfair priority — everyone is treated equally.'],
  ['🚫 No Wallet or Transaction Limits', 'There are no artificial caps on how much you can hold or move — promoting free, open participation.'],
  ['🚫 No Complex Tokenomics Gimmicks', 'The token does not rely on reflections, auto-liquidity, or rebasing mechanics — it is built for clarity, simplicity, and long-term reliability.']
];

const CONTRACT_CODE_URL = 'https://bscscan.com/address/0xYourSmartContractAddressHere#code';

const TokenomiksSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // 0 = tokenomics, 1 = not in contract
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset and start timer for auto-switch
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
  };

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === 1 ? 0 : 1));
  };

  return (
    <Box
      id="tokenomiks"
      sx={{
        py: { xs: 10, md: 16 },
        px: 2,
        backgroundImage: `url('/tokenomics/tokenomics.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0e1a1a',
        position: 'relative'
      }}
    >
      <Box sx={glassBoxStyle}>
        {/* Left/Right slider buttons */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            zIndex: 10
          }}
          aria-label="Previous"
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            zIndex: 10
          }}
          aria-label="Next"
        >
          <ChevronRightIcon />
        </IconButton>

        <AnimatePresence mode="wait">
          {currentIndex === 0 ? (
            <motion.div
              key="tokenomics"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInOut}
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, #ffffff, #90caf9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.8rem' }
                }}
              >
                Tokenomics
              </Typography>

              {tokenomicsContent.map(([title, content], i) => (
                <Box key={i} sx={{ mt: i === 0 ? 0 : 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>{title}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', pl: 1 }}>{content}</Typography>
                </Box>
              ))}

              <Typography variant="body2" sx={{ mt: 4, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                LandLord is more than just a token — it is a real-value distribution system designed for the future of decentralized property ownership and income sharing.
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              key="not-in-contract"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInOut}
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, #ffffff, #f48fb1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.8rem' }
                }}
              >
                What’s Not in the Contract
              </Typography>

              {notInContractContent.map(([title, content], i) => (
                <Box key={i} sx={{ mt: i === 0 ? 0 : 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>{title}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', pl: 1 }}>{content}</Typography>
                </Box>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dots Indicator */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            gap: 1,
            userSelect: 'none'
          }}
        >
          {[0, 1].map((idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              aria-label={`Switch to slide ${idx + 1}`}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setCurrentIndex(idx); }}
            />
          ))}
        </Box>
      </Box>

      {/* Fixed "View Source Code" button */}
      <Button
        variant="contained"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#1B5E20', // Dark green
          color: 'white',
          fontWeight: 'bold',
          '&:hover': {
            bgcolor: '#388E3C'
          },
          zIndex: 1000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}
        onClick={() => window.open(CONTRACT_CODE_URL, '_blank')}
      >
        View Source Code
      </Button>
    </Box>
  );
};

export default TokenomiksSection;
