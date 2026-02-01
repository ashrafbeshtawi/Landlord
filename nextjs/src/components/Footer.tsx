'use client';

import { Box, Typography, IconButton, Grid, Divider, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, Telegram, GitHub } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import PieChartIcon from '@mui/icons-material/PieChart';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import theme from '../theme/theme';
import { CONTRACT_ADDRESS } from '@/utils/constants';

const socialLinks = [
  { icon: <Facebook />, href: 'https://facebook.com/landlordtoken', label: 'Facebook' },
  { icon: <Twitter />, href: 'https://twitter.com/landlordtoken', label: 'Twitter' },
  { icon: <Instagram />, href: 'https://instagram.com/landlordtoken', label: 'Instagram' },
  { icon: <Telegram />, href: 'https://t.me/landlordtoken', label: 'Telegram' },
  { icon: <GitHub />, href: 'https://github.com/landlordtoken', label: 'GitHub' },
];

const quickLinks = [
  { label: 'Home', path: '/', icon: <HomeIcon sx={{ fontSize: 18 }} /> },
  { label: 'Tokenomics', path: '/tokenomics', icon: <PieChartIcon sx={{ fontSize: 18 }} /> },
  { label: 'Business Model', path: '/whitepaper', icon: <DescriptionIcon sx={{ fontSize: 18 }} /> },
  { label: 'Invest', path: '/invest', icon: <TrendingUpIcon sx={{ fontSize: 18 }} /> },
  { label: 'Team', path: '/team', icon: <GroupIcon sx={{ fontSize: 18 }} /> },
  { label: 'Contact', path: '/contact', icon: <ContactMailIcon sx={{ fontSize: 18 }} /> },
];

export default function Footer() {
  const router = useRouter();

  const copyToClipboard = () => {
    if (CONTRACT_ADDRESS) {
      navigator.clipboard.writeText(CONTRACT_ADDRESS);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '20%',
          width: '60%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
        },
      }}
    >
      {/* Main Footer Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
        <Grid container spacing={6}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 0 20px ${theme.palette.primary.main}30`,
                }}
              >
                <Image
                  src="/coin/coin3.png"
                  alt="LandLord Logo"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                LandLord
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, mb: 3, maxWidth: 300 }}
            >
              Revolutionizing real estate investment through blockchain technology.
              Own Syrian properties, earn rental income, and be part of the rebuilding effort.
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map(({ icon, href, label }) => (
                <IconButton
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      bgcolor: `${theme.palette.primary.main}20`,
                      border: `1px solid ${theme.palette.primary.main}50`,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: 'white', fontWeight: 700, mb: 3 }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {quickLinks.map(({ label, path, icon }) => (
                <Button
                  key={path}
                  onClick={() => router.push(path)}
                  startIcon={icon}
                  sx={{
                    justifyContent: 'flex-start',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 0,
                    '&:hover': {
                      color: theme.palette.primary.main,
                      background: 'transparent',
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: 1,
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* Contract Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: 'white', fontWeight: 700, mb: 3 }}
            >
              Smart Contract
            </Typography>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
                Contract Address (BSC)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                  }}
                >
                  {truncateAddress(CONTRACT_ADDRESS || '')}
                </Typography>
                <IconButton
                  size="small"
                  onClick={copyToClipboard}
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    p: 0.5,
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  <ContentCopyIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <Button
                variant="outlined"
                size="small"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                onClick={() => window.open(`https://bscscan.com/address/${CONTRACT_ADDRESS}`, '_blank')}
                sx={{
                  borderColor: `${theme.palette.primary.main}50`,
                  color: theme.palette.primary.main,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: `${theme.palette.primary.main}10`,
                  },
                }}
              >
                View on BscScan
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Bar */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 3, md: 6 },
          py: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: { xs: 'center', sm: 'left' } }}>
          © {new Date().getFullYear()} LandLord Token. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
          Built with blockchain technology for transparent real estate investment
        </Typography>
      </Box>
    </Box>
  );
}
