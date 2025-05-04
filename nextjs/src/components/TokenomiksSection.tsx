import theme from '../theme/theme'; // Import your theme
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

const TokenomiksSection = function () {

    return (
        <>
            <Box
                id="tokenomiks"
                sx={{
                    p: { xs: 2, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                <Box
                    sx={{
                    width: { xs: '90%', md: '60%' },
                    color: theme.palette.primary.main,
                    borderRadius: 2,
                    p: 3,
                    marginTop: '100px',
                    opacity: 0.95,
                    }}
                >
                <Typography variant="h3" sx={{ mb: 3, textAlign: 'center' }}>
                    Tokenomics
                </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    LandLord (LND) is a utility token designed for a real
                    estate-backed ecosystem — with built-in profit sharing and a
                    carefully controlled token supply.
                    </Typography>
                    <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                    >
                    ✅ Fixed Supply:
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                    100 trillion tokens minted at launch (18 decimals) — fully
                    transparent from day one.
                    </Typography>
                    <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                    >
                    📈 Profit Sharing:
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                    LND holders (excluding the owner) receive periodic profit
                    distributions based on their holdings — secured and verifiable.
                    </Typography>
                    <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                    >
                    🔒 Trustworthy Mechanics:
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                    Signature-based claims and protection against reentrancy ensure all
                    distributions are safe, fair, and technically sound.
                    </Typography>
                    <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                    >
                    🔥 Burnable Tokens:
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                    Any holder can reduce the total supply by burning tokens — helping
                    to increase scarcity and long-term value.
                    </Typography>
                    <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                    >
                    🏠 Controlled Minting:
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                    New tokens can only be minted by the owner and only up to 10% of
                    the existing supply, strictly for real estate acquisitions —
                    ensuring real utility and responsible expansion.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, mt: 2 }}>
                    LandLord is more than just a token — its a real-value
                    distribution system designed for the future of decentralized
                    property ownership and income sharing.
                    </Typography>
                </Box>
            </Box>

            <Box
            id="tokenomiks2"
            sx={{
                p: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            >
            <Typography variant="h3" sx={{ mb: 4, marginTop: '100px' }}>
                What’s Not in the Contract — By Design
            </Typography>
            <Box
                sx={{
                width: { xs: '90%', md: '60%' },
                color: theme.palette.primary.main,
                borderRadius: 2,
                p: 3,
                }}
            >
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                To build trust and fairness into the system, LandLordToken
                intentionally avoids features that can be misused or create
                imbalance:
                </Typography>
                <Typography
                variant="body1"
                sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                >
                🚫 No Transfer Restrictions:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                Tokens can be freely bought, held, and sold — there are no
                mechanisms that block users from accessing their assets.
                </Typography>
                
                <Typography
                variant="body1"
                sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                >
                🚫 No Transaction Fees or Hidden Deductions:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                Transfers happen 1:1 — there are no built-in taxes or fees
                applied to send, receive, or trade.
                </Typography>
                <Typography
                variant="body1"
                sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                >
                🚫 No Blacklisting or Special Privileges:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                The contract contains no functions that allow addresses to be
                blocked or given unfair priority — everyone is treated equally.
                </Typography>
                <Typography
                variant="body1"
                sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                >
                🚫 No Wallet or Transaction Limits:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                There are no artificial caps on how much you can hold or move —
                promoting free, open participation.
                </Typography>
                <Typography
                variant="body1"
                sx={{ lineHeight: 1.6, mt: 2, fontWeight: 'bold' }}
                >
                🚫 No Complex Tokenomics Gimmicks:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, ml: 2 }}>
                The token does not rely on reflections, auto-liquidity, or
                rebasing mechanics — its built for clarity, simplicity, and
                long-term reliability.
                </Typography>
            </Box>
            </Box>
        </>
    )
}

export default TokenomiksSection;