'use client';

import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import theme from '../theme/theme';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
const teamMembers = [
  {
    role: 'CEO & Backend',
    name: 'Ashraf',
    image: '/team/ashraf.png',
  },
  {
    role: 'Marketing',
    name: 'Nagham',
    image: '/team/nagham.png',
  },
  {
    role: 'Frontend',
    name: 'Mohammad',
    image: '/team/mohammad.png',
  },
];

export default function TeamSection() {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.1 }}>
      <Box id="team" sx={{ py: 10, px: 2 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ mb: 6, fontWeight: 'bold', color: theme.palette.text.primary }}
        >
          Our Team
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map(({ role, name, image }) => (
            <Grid key={name}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  bgcolor: theme.palette.background.default + 'B3',
                  borderRadius: 4,
                  boxShadow: 6,
                  width: 250,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: 12,
                  },
                }}
              >
              <Avatar
                src={image}
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  fontSize: 32,
                  bgcolor: image ? 'transparent' : theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  border: `4px solid ${theme.palette.secondary.main}`,
                  objectFit: 'cover',
                }}
              >
                {!image && name.charAt(0)}
              </Avatar>
                <CardContent>
                  <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '1rem' }}
                  >
                    {role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
}
