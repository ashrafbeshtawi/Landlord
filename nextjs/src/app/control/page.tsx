'use client';

import HolderPanel from '@/components/HolderPanel';
import ERC20Actions from '@/components/ERC20Actions';
import { Box } from '@mui/material';

export default function ControlPanel() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(tokenomics/tokenomics2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: { md: 'fixed' },
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: { xs: 6, md: 10 },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
                    zIndex: 1
                },
                '> *': {
                    position: 'relative',
                    zIndex: 2
                }
            }}
        >
            <HolderPanel />
            <ERC20Actions />
        </Box>
    );
}
