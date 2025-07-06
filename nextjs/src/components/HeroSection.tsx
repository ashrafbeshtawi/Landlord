'use client';

import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { CheckCircle, TrendingUp, Public, Security, ArrowForward, Description } from '@mui/icons-material';
import { motion } from 'framer-motion';
import theme from '../theme/theme';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  const features = [
    {
      icon: <CheckCircle sx={{ color: '#4CAF50', fontSize: 24 }} />,
      title: 'Asset-Backed',
      description: 'Real estate secured tokens'
    },
    {
      icon: <TrendingUp sx={{ color: '#FF9800', fontSize: 24 }} />,
      title: 'Dual Income',
      description: 'Rent + appreciation rewards'
    },
    {
      icon: <Public sx={{ color: '#2196F3', fontSize: 24 }} />,
      title: 'Global Access',
      description: 'Fractional ownership worldwide'
    },
    {
      icon: <Security sx={{ color: '#9C27B0', fontSize: 24 }} />,
      title: 'Transparent',
      description: 'On-chain smart contracts'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(house/house.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: { md: 'fixed' },
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
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
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Main Hero Content */}
          <Grid>
            <motion.div initial="initial" animate="animate" variants={staggerChildren}>
              <Box
                sx={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 5,
                  p: { xs: 4, md: 6 },
                  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50, #2196F3)`,
                    borderRadius: '5px 5px 0 0'
                  }
                }}
              >
                {/* Title */}
                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #ffffff 20%, #e3f2fd 80%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em'
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
                    variant="h5"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      mb: 4,
                      fontSize: { xs: '1.1rem', md: '1.4rem' },
                      fontWeight: 400,
                      lineHeight: 1.5,
                      maxWidth: '650px',
                      mx: 'auto'
                    }}
                  >
                    Seize the chance to own Syrian real estate at rock‑bottom prices with LandLord Coin (LND)—enjoy steady rental income, share in rebuilding impact, and benefit from blockchain’s security and transparency as demand surges.
                  </Typography>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={fadeInUp}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => router.push('/invest')}
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, #4CAF50)`,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: 'none',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        '&:hover': {
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, #45a049)`,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
                        }
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
                        borderColor: 'rgba(255,255,255,0.5)',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: 3,
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white'
                        }
                      }}
                    >
                      Business Model
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          {/* Features Sidebar */}
          <Grid sx={{ width: '100%' }}>
            <motion.div initial="initial" animate="animate" variants={staggerChildren}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      mb: 2,
                      textAlign: 'center'
                    }}
                  >
                    Why Choose LandLord Coin?
                  </Typography>
                </motion.div>

                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                  {features.map((feature, index) => (
                    <Grid key={index}>
                      <motion.div
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card
                          sx={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                              border: '1px solid rgba(255,255,255,0.3)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                              {feature.icon}
                              <Typography
                                variant="h6"
                                sx={{
                                  mt: 1,
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '1.1rem'
                                }}
                              >
                                {feature.title}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.95rem',
                                lineHeight: 1.4
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
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
