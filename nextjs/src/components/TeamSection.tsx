'use client';

import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import theme from '../theme/theme';

const teamMembers = [
  { role: 'Solidity Developer', name: 'Ashraf' },
  { role: 'Marketing', name: 'Nagham' },
  { role: 'Frontend', name: 'Muhammad' },
];

export default function TeamSection() {
  return (
    <Box id="team" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" sx={{ mb: 4 }}>
        Our Team
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map(({ role, name }) => (
          <Grid key={role}>
            <Card
              sx={{
                textAlign: 'center',
                p: 2,
                bgcolor: theme.palette.secondary.main,
                borderRadius: 2,
                boxShadow: 10,
              }}
            >
              <Avatar sx={{ width: 72, height: 72, mx: 'auto', mb: 2 }}>
                {name.charAt(0)}
              </Avatar>
              <CardContent>
                <Typography variant="h6" color="text.primary">
                  {name}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
