import theme from '../theme/theme'; // Import your theme
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const WhitepaperSection = () => {

    return (
        <Box
          id="whitepaper"
          sx={{
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ mb: 2, marginTop: '100px', color: '#FFFFFF' }}>
            Whitepaper
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: '#34C6A3', width: { xs: '90%', md: '60%' }, textAlign: 'center' }}>
            Our comprehensive whitepaper provides in-depth details on the LandLord Coin vision, tokenomics, technical architecture, and roadmap. Explore the full documentation to understand our project’s foundation and future plans.
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
            onClick={() => window.open('/whitepaper.pdf', '_blank')}
          >
            <strong>Download Whitepaper</strong>
          </Button>
        </Box>
    );
}

export default WhitepaperSection;