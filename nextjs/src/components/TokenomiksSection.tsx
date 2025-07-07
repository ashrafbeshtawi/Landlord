'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const CONTAINERS = [
  {
    title: 'Tokenomics',
    items: [
      ['✅ Fixed Supply', '100 trillion tokens minted at launch — fully transparent from day one.'],
      ['📈 Profit Sharing', 'LND holders receive periodic profits based on holdings — verifiable and fair.'],
      ['🔥 Burnable Tokens', 'Any holder can burn tokens — increasing scarcity and long-term value.'],
      ['🏠 Controlled Minting', 'Owner can mint up to 10% of supply — only for real estate purchases.']
    ],
    gradient: 'linear-gradient(45deg, #ffffff, #1DCD9F)'
  },
  {
    title: 'What’s Not in the Contract',
    items: [
      ['🚫 No Transfer Restrictions', 'Tokens can be freely bought, held, and sold — no access blocking.'],
      ['🚫 No Transaction Fees', 'Transfers happen 1:1 — no built-in taxes.'],
      ['🚫 No Wallet or TX Limits', 'No caps on how much you can hold or transfer.'],
      ['🚫 No Blacklisting', 'All users are treated equally — no backdoors.']
    ],
    gradient: 'linear-gradient(45deg, #ffffff, #169976)'
  }
];

const transitionVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8
  })
};

export default function TokenomiksSliderSection() {
  const theme = useTheme();
  const [[index, direction], setIndex] = useState([0, 0]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = (dir: number) => {
    setIndex(([prev]) => [(prev + dir + CONTAINERS.length) % CONTAINERS.length, dir]);
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
        position: 'relative',
        backgroundImage: 'url(/tokenomics/tokenomics.png)', // ⬅️ your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        px: { xs: 2, md: 4 },
        py: 12,
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
      <Box
        sx={{
          maxWidth: '1000px',
          mx: 'auto',
          position: 'relative',
          height: { xs: 'auto', md: '500px' }
        }}
      >
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={transitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(25px)',
                borderRadius: 5,
                p: { xs: 3, md: 5 },
                height: '100%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: 'center',
                    background: CONTAINERS[index].gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  {CONTAINERS[index].title}
                </Typography>

                {CONTAINERS[index].items.map(([title, content], i) => (
                  <Box key={i} sx={{ mt: i === 0 ? 3 : 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.text.primary }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', pl: 1 }}>
                      {content}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={() => window.open('https://bscscan.com/address/0xYourSmartContractAddressHere', '_blank')}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.secondary.main },
                    fontWeight: 600,
                    px: 4,
                    py: 1
                  }}
                >
                  View Source Code
                </Button>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Navigation Dots */}
      <Box sx={{ textAlign: 'center', mt: 6, position: 'relative', zIndex: 2 }}>
        {CONTAINERS.map((_, i) => (
          <Button
            key={i}
            size="small"
            onClick={() => paginate(i - index)}
            sx={{
              minWidth: 12,
              height: 12,
              borderRadius: '50%',
              mx: 0.5,
              backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.4)',
              '&:hover': {
                backgroundColor: 'white'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
