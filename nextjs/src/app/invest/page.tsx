'use client';

import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VerifiedIcon from '@mui/icons-material/Verified';
import CodeIcon from '@mui/icons-material/Code';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useRouter } from 'next/navigation';
import theme from '@/theme/theme';
import { CONTRACT_ADDRESS } from '@/utils/constants';

const EXPLORER_URL = `https://bscscan.com/address/${CONTRACT_ADDRESS}`;
const CONTRACT_CODE_URL = `${EXPLORER_URL}#code`;

const DEX_LIST = [
  {
    name: 'PancakeSwap',
    url: 'https://pancakeswap.finance/swap',
    icon: '/swap/pancake.png',
    color: '#1FC7D4',
  },
  {
    name: 'ApeSwap',
    url: 'https://apeswap.finance/swap',
    icon: '/swap/ape.png',
    color: '#FFB300',
  },
  {
    name: 'Biswap',
    url: 'https://biswap.org/swap',
    icon: '/swap/bi.png',
    color: '#1263F1',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function BecomeInvestorPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ duration: 0.5 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
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
              <RocketLaunchIcon sx={{ fontSize: 40, color: 'white' }} />
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
              Become an Investor
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, mx: 'auto' }}>
              Join the future of real estate investment on the blockchain
            </Typography>
          </Box>
        </motion.div>

        {/* Smart Contract Card */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <VerifiedIcon sx={{ color: '#4CAF50', fontSize: 28 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Verified Smart Contract
              </Typography>
              <Chip label="BSC" size="small" sx={{ bgcolor: '#F3BA2F20', color: '#F3BA2F' }} />
            </Box>

            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.7 }}>
              Our smart contract is deployed on the Binance Smart Chain and fully audited.
              You can view the source code and verify all transactions on the blockchain explorer.
            </Typography>

            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(0,0,0,0.3)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}
              >
                {CONTRACT_ADDRESS || '0x...'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<OpenInNewIcon />}
                onClick={() => window.open(EXPLORER_URL, '_blank')}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: 'rgba(29,205,159,0.1)' },
                }}
              >
                Explorer
              </Button>
            </Box>

            <Button
              variant="contained"
              startIcon={<CodeIcon />}
              onClick={() => window.open(CONTRACT_CODE_URL, '_blank')}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              View Source Code on BscScan
            </Button>
          </Paper>
        </motion.div>

        {/* DEX Section */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3, textAlign: 'center' }}>
              Buy $LND on Popular DEXs
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {DEX_LIST.map((dex, index) => (
                <Grid key={dex.name} size={{ xs: 12, sm: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card
                      sx={{
                        background: `linear-gradient(145deg, ${dex.color}15, ${dex.color}05)`,
                        border: `1px solid ${dex.color}30`,
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          border: `1px solid ${dex.color}60`,
                          boxShadow: `0 10px 30px ${dex.color}20`,
                        },
                      }}
                      onClick={() => window.open(dex.url, '_blank')}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Box sx={{ mb: 2 }}>
                          <Image
                            src={dex.icon}
                            alt={`${dex.name} logo`}
                            width={50}
                            height={50}
                            style={{ borderRadius: 12 }}
                          />
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                          {dex.name}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            borderColor: dex.color,
                            color: dex.color,
                            fontSize: '0.8rem',
                            '&:hover': { bgcolor: `${dex.color}15` },
                          }}
                        >
                          Trade Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* CTA Section */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: `1px solid ${theme.palette.primary.main}30`,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
              Planning a Major Investment?
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
              Contact us directly for partnership opportunities and large-scale investments.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<ContactMailIcon />}
              onClick={() => router.push('/contact')}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Contact Us
            </Button>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
