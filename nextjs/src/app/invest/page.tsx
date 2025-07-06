'use client';

import theme from '@/theme/theme';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const TITLE_COLOR = '#FFFFFF';
const BODY_COLOR = '#34C6A3';
const CONTENT_WIDTH = '800px';

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

const BecomeInvestorSection = () => (
  <Box
    id="become-investor"
    sx={{
      p: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
    }}
  >
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
      <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
        <Typography
          variant="h3"
          sx={{ color: TITLE_COLOR, fontWeight: 700, mt: 8, mb: 2, textAlign: 'center' }}
        >
          Become an Investor
        </Typography>
      </Box>
    </motion.div>

    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.1 }}>
      <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6, color: BODY_COLOR, textAlign: 'center' }}>
          Our smart contract is deployed on the Binance Smart Chain and fully audited. You can view it on the blockchain explorer and buy $LND on popular decentralized exchanges (DEXs) listed below.
        </Typography>

        <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.6, color: BODY_COLOR, textAlign: 'center' }}>
          <strong>Smart Contract:</strong>{' '}
          <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer" style={{ color: BODY_COLOR, textDecoration: 'underline' }}>
            {CONTRACT_ADDRESS}
          </a>
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.4, textAlign: 'center' }}>
          <a href={CONTRACT_CODE_URL} target="_blank" rel="noopener noreferrer" style={{ color: BODY_COLOR, textDecoration: 'underline' }}>
            🔍 View Contract Code on BscScan
          </a>
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR, textAlign: 'center' }}>
          <strong>Buy on DEX:</strong>
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 6 }}>
          {DEX_LIST.map(({ name, url, icon }) => (
            <motion.div whileHover={{ scale: 1.05 }} key={name}>
              <Button
                variant="contained"
                onClick={() => window.open(url, '_blank')}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': { backgroundColor: theme.palette.secondary.main },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1
                }}
              >
                <Image
                  src={icon}
                  alt={`${name} logo`}
                  width={20}
                  height={20}
                  style={{ borderRadius: '4px' }}
                />
                {name}
              </Button>
            </motion.div>
          ))}
        </Box>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6, color: BODY_COLOR, textAlign: 'center' }}>
          💡 If you&apos;re planning a major investment or interested in collaboration, please{' '}
          <a href="/contact" style={{ color: BODY_COLOR, textDecoration: 'underline' }}>
            contact us
          </a>{' '}
          directly.
        </Typography>
      </Box>
    </motion.div>
  </Box>
);

export default BecomeInvestorSection;
