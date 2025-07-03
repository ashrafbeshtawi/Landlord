'use client';
import theme from '../theme/theme';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const TITLE_COLOR = '#FFFFFF';
const BODY_COLOR = '#34C6A3';
const CONTENT_WIDTH = '800px';

const WhitepaperSection = () => (
  <Box
    id="whitepaper"
    sx={{
      p: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
    }}
  >
    {/* Main Title */}
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
      <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
        <Typography
          variant="h3"
          sx={{ color: TITLE_COLOR, fontWeight: 700, mt: 8, mb: 2, textAlign: 'center' }}
        >
          Business Model
        </Typography>
      </Box>
    </motion.div>

    {/* Introduction */}
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.1 }}>
      <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
        <Typography
          variant="body1"
          sx={{ mb: 6, lineHeight: 1.6, color: BODY_COLOR, textAlign: 'center' }}
        >
          The Landlord Token project introduces an innovative approach to real estate investment by leveraging the power of cryptocurrency and Web3 technologies. This whitepaper outlines the vision, technical architecture, and market strategy of the project, which uses blockchain to enable global participation in high-yield real estate opportunities in emerging markets.
        </Typography>
      </Box>
    </motion.div>





    {/* Sections */}
    {[
      {
        title: '1. Whitepaper Summary',
        body: (
          <>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
          Landlord Token (LND) leverages blockchain to make real estate investment accessible and transparent. In Phase 1, the focus is on acquiring and renovating affordable properties in Syria and renting them to generate income, which is then distributed to token holders. Phase 2 includes constructing new buildings and expanding into Egypt and Turkey.<br/><br/>
          The token operates on secure ERC-20 smart contracts with built-in signature verification and reentrancy protection. ROI analysis highlights Syria&apos;s exceptional potential (up to 60% annually via short-term rentals), while Egypt and Turkey offer solid returns. The USA and Germany serve as low-yield benchmarks. LND empowers fractional ownership, income generation, and impact investment in rebuilding regions.            
          </Typography>
          <br/>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto', textAlign: 'center' }}>
              <Button
                variant="contained"
                sx={{ mb: 8, backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
                onClick={() => window.open('/whitepaper.pdf', '_blank')}
              >
                <strong>Download full Whitepaper</strong>
              </Button>
            </Box>
          </motion.div>
          </> 
        )
      },
      {
        title: '2. Project Overview',
        body: (
          <>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>2.1. Landlord Token (LND)</strong><br />
              LND is an ERC-20 token that distributes real estate profits to holders based on their ownership share. Built on OpenZeppelin standards, it features a fixed supply with optional mint/burn flexibility.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>2.2. Technology Stack</strong><br />
              Developed in Solidity and deployed via Hardhat, the system integrates Ethers.js and includes robust security (ECDSA, key rotation, reentrancy protection) to safeguard funds.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>2.3. Profit Distribution Workflow</strong><br />
              Distributions are initiated by the owner, calculated off-chain, and claimed via signed messages. Only verified claims are accepted, and transfers are protected against reentrancy.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>2.4. Security Considerations</strong><br />
              The system includes ECDSA signature checks, backend key rotation, exclusion of owner from claims, and safe transfer logic—all contributing to a trustworthy token economy.
            </Typography>
          </>
        )
      },
      {
        title: '3. Market Analysis: Real Estate Investment Opportunities',
        body: (
          <>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>3.1. Syria</strong><br />
              Avg. price: $15,000, rent: $150–$1,000/mo. ROI: 12% (long-term), 60% (short-term)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>3.2. Egypt</strong><br />
              Avg. price: $70,430, rent: $462.80–$535/mo. ROI: 7.88% (long), 9.11% (short)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>3.3. Turkey</strong><br />
              Avg. price: $99,372, rent: $476–$696/mo. ROI: 5.75% (long), 8.41% (short)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>3.4. United States</strong><br />
              Avg. price: $371,300, rent: $1,703–$2,000+/mo. ROI: 5.50% (long), 6.47% (short)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>3.5. Germany</strong><br />
              Avg. price: $379,773, rent: $990–$2,473/mo. ROI: 3.13% (long), 7.82% (short)
            </Typography>
          </>
        )
      },
      {
        title: '4. Return on Investment (ROI) Comparison',
        body: (
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
            ROI = annual rent ÷ property price. Syria leads (12–60%), followed by Egypt and Turkey. USA and Germany are used as benchmarks for stability but offer lower returns.
          </Typography>
        )
      },
      {
        title: '5. Core Business Model',
        body: (
          <>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>Phase 1: Renovation of Existing Properties in Syria</strong><br />
              The initial phase focuses on acquiring undervalued properties in Syria that need renovation. Our engineering team renovates them affordably, and the units are rented to locals, aid workers, and early returnees. Income is distributed to LND holders via smart contracts.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              <strong>Phase 2: Expansion & New Construction</strong><br />
              Once stable income is achieved, we purchase land in high-potential areas and develop new residential or mixed-use buildings. These new assets are either rented or sold, with profits reinvested or distributed to token holders.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, color: BODY_COLOR }}>
              The two-phase approach enables sustainable growth and local job creation. It also allows token holders to benefit from real estate returns without traditional barriers.
            </Typography>
          </>
        )
      },
      {
        title: '6. Conclusion',
        body: (
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6, color: BODY_COLOR }}>
            Landlord Token democratizes access to high-yield real estate via secure tokenomics and blockchain automation. The phased business model starts with Syrian property renovation and scales into construction and new markets like Egypt and Turkey. It offers strong ROI and social impact, merging profitability with purpose.
          </Typography>
        )
      }
    ].map(({ title, body }, i) => (
      <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 + i * 0.1 }}>
        <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
          <Typography variant="h4" sx={{ color: TITLE_COLOR, fontWeight: 600, mt: 4, mb: 1, textAlign: 'center' }}>
            {title}
          </Typography>
          {body}
        </Box>
      </motion.div>
    ))}
  </Box>
);

export default WhitepaperSection;
