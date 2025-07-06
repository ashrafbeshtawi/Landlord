'use client';

import theme from '@/theme/theme';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const CONTRACT_ADDRESS = '0xYourSmartContractAddressHere';
const EXPLORER_URL = `https://bscscan.com/address/${CONTRACT_ADDRESS}`;
const CONTRACT_CODE_URL = `${EXPLORER_URL}#code`;

const DEX_LIST = [
  {
    name: 'PancakeSwap',
    url: 'https://pancakeswap.finance/swap',
    icon: '/swap/pancake.png'
  },
  {
    name: 'ApeSwap',
    url: 'https://apeswap.finance/swap',
    icon: '/swap/ape.png'
  },
  {
    name: 'Biswap',
    url: 'https://biswap.org/swap',
    icon: '/swap/bi.png'
  }
];

const sectionStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  border: '1px solid rgba(255,255,255,0.15)',
  backdropFilter: 'blur(25px)',
  borderRadius: 5,
  p: { xs: 3, md: 5 },
  boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
  color: 'white'
};

const TITLE_GRADIENT = {
  background: 'linear-gradient(45deg,rgb(255, 255, 255),rgb(2, 88, 48))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const BecomeInvestorSection = () => (
  <Box
    id="become-investor"
    sx={{
      px: { xs: 2, md: 6 },
      py: { xs: 6, md: 10 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    {/* Section Title */}
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
      <Typography
        variant="h3"
        sx={{ ...TITLE_GRADIENT, fontWeight: 800, textAlign: 'center', mb: 4, fontSize: { xs: '2rem', md: '2.8rem' } }}
      >
        Become an Investor
      </Typography>
    </motion.div>

    {/* Section Content */}
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.15 }}>
      <Box sx={{ ...sectionStyle, maxWidth: 900, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
          Our smart contract is deployed on the Binance Smart Chain and fully audited. You can view it on the blockchain explorer and buy $LND on popular decentralized exchanges (DEXs) listed below.
        </Typography>

        {/* Contract Address */}
        <Typography variant="body1" sx={{ mb: 1.5, color: 'rgba(255,255,255,0.9)' }}>
          <strong>Smart Contract:</strong>{' '}
          <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#64ffda', textDecoration: 'underline' }}>
            {CONTRACT_ADDRESS}
          </a>
        </Typography>

        <Typography variant="body2" sx={{ mb: 3 }}>
          <a href={CONTRACT_CODE_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#64ffda', textDecoration: 'underline' }}>
            🔍 View Contract Code on BscScan
          </a>
        </Typography>

        {/* DEX Buttons */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#aef5c5' }}>
          Buy on DEX:
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 5 }}>
          {DEX_LIST.map(({ name, url, icon }) => (
            <motion.div whileHover={{ scale: 1.05 }} key={name}>
              <Button
                variant="contained"
                onClick={() => window.open(url, '_blank')}
                sx={{
                  px: 3,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  borderRadius: 3,
                  background: theme.palette.primary.main,
                  color: 'black',
                  fontWeight: 600,
                }}
              >
                <Image src={icon} alt={`${name} logo`} width={24} height={24} style={{ borderRadius: '4px' }} />
                {name}
              </Button>
            </motion.div>
          ))}
        </Box>

        {/* CTA */}
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
          💡 Planning a major investment or partnership?
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
          <a href="/contact" style={{ color: '#64ffda', textDecoration: 'underline' }}>
            Contact us directly.
          </a>
        </Typography>
      </Box>
    </motion.div>
  </Box>
);

export default BecomeInvestorSection;
