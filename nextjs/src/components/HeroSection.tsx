'use client';

import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { CheckCircle, TrendingUp, Public, Security, ArrowForward, Description } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import theme from '../theme/theme';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  const features = [
    {
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      title: 'Asset-Backed',
      description: 'Real estate secured tokens',
      color: '#4CAF50',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 28 }} />,
      title: 'Dual Income',
      description: 'Rent + appreciation rewards',
      color: '#FF9800',
    },
    {
      icon: <Public sx={{ fontSize: 28 }} />,
      title: 'Global Access',
      description: 'Fractional ownership worldwide',
      color: '#2196F3',
    },
    {
      icon: <Security sx={{ fontSize: 28 }} />,
      title: 'Transparent',
      description: 'On-chain smart contracts',
      color: '#9C27B0',
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 10 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: '40%',
          height: '40%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
          filter: 'blur(60px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, #4CAF5015 0%, transparent 70%)',
          filter: 'blur(60px)',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Main Hero Content */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <motion.div initial="initial" animate="animate" variants={staggerChildren}>
              <Box
                sx={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  p: { xs: 4, md: 6 },
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Accent line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50, #2196F3)`,
                  }}
                />

                {/* Title */}
                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.2rem', md: '3rem', lg: '3.5rem' },
                      fontWeight: 800,
                      background: `linear-gradient(135deg, #ffffff 0%, ${theme.palette.primary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Revolutionizing
                    <br />
                    Real Estate
                  </Typography>
                </motion.div>

                {/* Subtitle */}
                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      mb: 4,
                      fontSize: { xs: '1rem', md: '1.15rem' },
                      fontWeight: 400,
                      lineHeight: 1.7,
                      maxWidth: 600,
                    }}
                  >
                    Seize the chance to own Syrian real estate at rock-bottom prices with LandLord Coin (LND)—enjoy
                    steady rental income, share in rebuilding impact, and benefit from blockchain&apos;s security and
                    transparency.
                  </Typography>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={fadeInUp}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => router.push('/invest')}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: 'none',
                        boxShadow: `0 10px 30px ${theme.palette.primary.main}30`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 15px 40px ${theme.palette.primary.main}40`,
                        },
                      }}
                    >
                      Start Investing
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Description />}
                      onClick={() => router.push('/whitepaper')}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: 3,
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                      }}
                    >
                      Business Model
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          {/* Image Showcase & Features */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <motion.div initial="initial" animate="animate" variants={staggerChildren}>
              {/* Syria Rebuild Image */}
              <motion.div variants={fadeInUp}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    mb: 3,
                  }}
                >
                  <Image
                    src="/house/syria-rebuild2.png"
                    alt="Syria Rebuild Project"
                    width={600}
                    height={350}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                      Rebuilding Syria&apos;s Future
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              {/* Features Row */}
              <motion.div variants={fadeInUp}>
                <Grid container spacing={1.5} sx={{ mt: 4 }}>
                  {features.map((feature, index) => (
                    <Grid key={index} size={{ xs: 6 }}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -3 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Card
                          sx={{
                            background: `linear-gradient(145deg, ${feature.color}15, ${feature.color}05)`,
                            backdropFilter: 'blur(15px)',
                            border: `1px solid ${feature.color}30`,
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: `0 10px 20px ${feature.color}20`,
                              border: `1px solid ${feature.color}50`,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1.5,
                                bgcolor: `${feature.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 1,
                                color: feature.color,
                              }}
                            >
                              {feature.icon}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                              }}
                            >
                              {feature.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.7rem',
                              }}
                            >
                              {feature.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
