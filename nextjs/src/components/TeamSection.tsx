'use client';

import { Box, Typography, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import GroupsIcon from '@mui/icons-material/Groups';
import CodeIcon from '@mui/icons-material/Code';
import CampaignIcon from '@mui/icons-material/Campaign';
import WebIcon from '@mui/icons-material/Web';
import theme from '../theme/theme';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const teamMembers = [
  {
    role: 'CEO & Backend',
    name: 'Ashraf',
    image: '/team/ashraf.png',
    icon: <CodeIcon />,
    color: theme.palette.primary.main,
  },
  {
    role: 'Marketing',
    name: 'Nagham',
    image: '/team/nagham.png',
    icon: <CampaignIcon />,
    color: '#FF9800',
  },
  {
    role: 'Frontend',
    name: 'Mohammad',
    image: '/team/mohammad.png',
    icon: <WebIcon />,
    color: '#2196F3',
  },
];

export default function TeamSection() {
  return (
    <Box
      id="team"
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
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
              <GroupsIcon sx={{ fontSize: 40, color: 'white' }} />
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
              Meet Our Team
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, mx: 'auto' }}>
              The passionate people behind LandLord Token
            </Typography>
          </Box>
        </motion.div>

        {/* Team Cards */}
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid key={member.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  sx={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: `1px solid ${member.color}50`,
                      boxShadow: `0 20px 40px rgba(0,0,0,0.3)`,
                    },
                  }}
                >
                  {/* Top colored bar */}
                  <Box sx={{ height: 4, background: `linear-gradient(90deg, ${member.color}, ${member.color}80)` }} />

                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    {/* Avatar */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <Avatar
                        src={member.image}
                        sx={{
                          width: 120,
                          height: 120,
                          border: `4px solid ${member.color}`,
                          bgcolor: member.image ? 'transparent' : member.color,
                          fontSize: 48,
                        }}
                      >
                        {!member.image && member.name.charAt(0)}
                      </Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: member.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '3px solid #1a1a2e',
                          color: 'white',
                        }}
                      >
                        {member.icon}
                      </Box>
                    </Box>

                    {/* Name */}
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {member.name}
                    </Typography>

                    {/* Role */}
                    <Chip
                      label={member.role}
                      sx={{
                        bgcolor: `${member.color}20`,
                        color: member.color,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
