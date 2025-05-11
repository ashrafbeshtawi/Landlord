'use client'; // needed for interactivity in Next.js 13+ App Router

import { Box, Typography, Button, Divider } from '@mui/material';
import theme from '../theme/theme';
import { useActionStore } from '@/store/store';



const HolderPanel = () => {


  return (
    <Box
      id="holder-panel"
      sx={{
        mt: 12,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 4,
        boxShadow: 3,
        width: { xs: '90%', md: '50%' },
        mx: 'auto',
        bgcolor: theme.palette.background.default + 'B3', 
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
       ⚙️ Holder Dashboard
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
       🔐 Connected Wallet: <strong>{useActionStore.getState().walletAdresse}</strong>
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        💰 Your LND Balance: <strong>{123} LND</strong>
      </Typography>


      <Divider sx={{ width: '100%', my: 2 }} />

      <Button variant="outlined" color="secondary">
        View Distribution History
      </Button>
    </Box>
  );
};

export default HolderPanel;
