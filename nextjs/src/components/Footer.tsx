'use client';
import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import { Facebook, Twitter, Instagram, Telegram } from '@mui/icons-material';
import theme from '../theme/theme';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
      }}
    >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          {/* left: All rights reserved */}
          <Box>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              © {new Date().getFullYear()} Land Lord. All rights reserved.
            </Typography>
          </Box>

          {/* Right: Social Media Icons */}
          <Box>
            <Stack direction="row">
              <IconButton href="https://facebook.com/dummyprofile" target="_blank" rel="noopener" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton href="https://twitter.com/dummyprofile" target="_blank" rel="noopener" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton href="https://instagram.com/dummyprofile" target="_blank" rel="noopener" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton href="https://t.me/dummyprofile" target="_blank" rel="noopener" aria-label="Telegram">
                <Telegram />
              </IconButton>
            </Stack>
          </Box>

        </Box>
    </Box>
  );
}
