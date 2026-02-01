'use client';

import { Box, Typography, Button, Paper, Grid, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { motion } from 'framer-motion';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GavelIcon from '@mui/icons-material/Gavel';
import theme from '@/theme/theme';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const sections = [
  {
    title: '1. Whitepaper Summary',
    icon: <SummarizeIcon />,
    content: `Landlord Token (LND) leverages blockchain to make real estate investment accessible and transparent. In Phase 1, the focus is on acquiring and renovating affordable properties in Syria and renting them to generate income, which is then distributed to token holders. Phase 2 includes constructing new buildings and expanding into Egypt and Turkey.

The token operates on secure ERC-20 smart contracts with built-in signature verification and reentrancy protection. ROI analysis highlights Syria's exceptional potential (up to 60% annually via short-term rentals), while Egypt and Turkey offer solid returns.`,
    hasDownload: true,
  },
  {
    title: '2. Project Overview',
    icon: <BusinessIcon />,
    subsections: [
      { subtitle: 'Landlord Token (LND)', text: 'LND is an ERC-20 token that distributes real estate profits to holders based on their ownership share. Built on OpenZeppelin standards, it features a fixed supply with optional mint/burn flexibility.' },
      { subtitle: 'Technology Stack', text: 'Developed in Solidity and deployed via Hardhat, the system integrates Ethers.js and includes robust security (ECDSA, key rotation, reentrancy protection) to safeguard funds.' },
      { subtitle: 'Profit Distribution Workflow', text: 'Distributions are initiated by the owner, calculated off-chain, and claimed via signed messages. Only verified claims are accepted, and transfers are protected against reentrancy.' },
      { subtitle: 'Security Considerations', text: 'The system includes ECDSA signature checks, backend key rotation, exclusion of owner from claims, and safe transfer logic—all contributing to a trustworthy token economy.' },
    ],
  },
  {
    title: '3. Market Analysis',
    icon: <TrendingUpIcon />,
    subsections: [
      { subtitle: 'Syria', text: 'Avg. price: $15,000, rent: $150–$1,000/mo. ROI: 12% (long-term), 60% (short-term)', highlight: true },
      { subtitle: 'Egypt', text: 'Avg. price: $70,430, rent: $462–$535/mo. ROI: 7.88% (long), 9.11% (short)' },
      { subtitle: 'Turkey', text: 'Avg. price: $99,372, rent: $476–$696/mo. ROI: 5.75% (long), 8.41% (short)' },
      { subtitle: 'United States', text: 'Avg. price: $371,300, rent: $1,703–$2,000+/mo. ROI: 5.50% (long), 6.47% (short)' },
      { subtitle: 'Germany', text: 'Avg. price: $379,773, rent: $990–$2,473/mo. ROI: 3.13% (long), 7.82% (short)' },
    ],
  },
  {
    title: '4. ROI Comparison',
    icon: <AccountBalanceIcon />,
    content: 'ROI = annual rent ÷ property price. Syria leads (12–60%), followed by Egypt and Turkey. USA and Germany are used as benchmarks for stability but offer lower returns.',
  },
  {
    title: '5. Core Business Model',
    icon: <SecurityIcon />,
    subsections: [
      { subtitle: 'Phase 1: Renovation', text: 'The initial phase focuses on acquiring undervalued properties in Syria that need renovation. Our engineering team renovates them affordably, and the units are rented to locals, aid workers, and early returnees. Income is distributed to LND holders via smart contracts.' },
      { subtitle: 'Phase 2: Expansion', text: 'Once stable income is achieved, we purchase land in high-potential areas and develop new residential or mixed-use buildings. These new assets are either rented or sold, with profits reinvested or distributed to token holders.' },
    ],
  },
  {
    title: '6. Conclusion',
    icon: <GavelIcon />,
    content: 'Landlord Token democratizes access to high-yield real estate via secure tokenomics and blockchain automation. The phased business model starts with Syrian property renovation and scales into construction and new markets. It offers strong ROI and social impact, merging profitability with purpose.',
  },
];

export default function WhitepaperSection() {
  return (
    <Box
      id="whitepaper"
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
              <DescriptionIcon sx={{ fontSize: 40, color: 'white' }} />
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
              Business Model
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 700, mx: 'auto' }}>
              An innovative approach to real estate investment leveraging blockchain and Web3 technologies
            </Typography>
          </Box>
        </motion.div>

        {/* Intro Card */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: `1px solid ${theme.palette.primary.main}30`,
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, mb: 3 }}>
              The Landlord Token project enables global participation in high-yield real estate opportunities
              in emerging markets through blockchain technology and transparent smart contracts.
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => window.open('/whitepaper.pdf', '_blank')}
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
              Download Full Whitepaper
            </Button>
          </Paper>
        </motion.div>

        {/* Accordion Sections */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
            >
              <Accordion
                defaultExpanded={index === 0}
                sx={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px !important',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: `${theme.palette.primary.main}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                  {section.content && (
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                      {section.content}
                    </Typography>
                  )}
                  {section.subsections && (
                    <Grid container spacing={2}>
                      {section.subsections.map((sub, i) => (
                        <Grid key={i} size={12}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: sub.highlight ? `${theme.palette.primary.main}15` : 'rgba(255,255,255,0.03)',
                              border: sub.highlight ? `1px solid ${theme.palette.primary.main}30` : '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                {sub.subtitle}
                              </Typography>
                              {sub.highlight && (
                                <Chip label="Best ROI" size="small" sx={{ bgcolor: '#4CAF5020', color: '#4CAF50', fontSize: '0.7rem' }} />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                              {sub.text}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  {section.hasDownload && (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => window.open('/whitepaper.pdf', '_blank')}
                        sx={{
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          '&:hover': { bgcolor: 'rgba(29,205,159,0.1)' },
                        }}
                      >
                        Download Full Whitepaper
                      </Button>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
