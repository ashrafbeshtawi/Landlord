'use client';

import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import theme from '@/theme/theme';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const sectionBoxStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(25px)',
  borderRadius: 5,
  p: { xs: 3, md: 5 },
  boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
  color: 'white',
  mt: 6
};

const TITLE_GRADIENT = {
  background: 'linear-gradient(45deg,rgb(81, 105, 86),rgb(17, 185, 129))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const SUBTITLE_GRADIENT = {
  background: 'linear-gradient(45deg, #64ffda, #1de9b6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const WhitepaperSection = () => (
  <Box id="whitepaper" sx={{ px: { xs: 2, md: 8 }, py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* Title */}
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
      <Typography variant="h3" sx={{ ...TITLE_GRADIENT, fontWeight: 800, textAlign: 'center', mb: 4, fontSize: { xs: '2rem', md: '2.8rem' } }}>
        Business Model
      </Typography>
    </motion.div>

    {/* Intro Section */}
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.1 }}>
      <Box sx={{ ...sectionBoxStyle, maxWidth: 900 }}>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.7 }}>
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
            <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', mb: 3 }}>
              Landlord Token (LND) leverages blockchain to make real estate investment accessible and transparent. In Phase 1, the focus is on acquiring and renovating affordable properties in Syria and renting them to generate income, which is then distributed to token holders. Phase 2 includes constructing new buildings and expanding into Egypt and Turkey.<br /><br />
              The token operates on secure ERC-20 smart contracts with built-in signature verification and reentrancy protection. ROI analysis highlights Syria’s exceptional potential (up to 60% annually via short-term rentals), while Egypt and Turkey offer solid returns. The USA and Germany serve as low-yield benchmarks. LND empowers fractional ownership, income generation, and impact investment in rebuilding regions.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  sx={{
                    background: theme.palette.primary.main,
                    color: 'black',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                  onClick={() => window.open('/whitepaper.pdf', '_blank')}
                >
                  Download full Whitepaper
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
            {[
              ['2.1. Landlord Token (LND)', 'LND is an ERC-20 token that distributes real estate profits to holders based on their ownership share. Built on OpenZeppelin standards, it features a fixed supply with optional mint/burn flexibility.'],
              ['2.2. Technology Stack', 'Developed in Solidity and deployed via Hardhat, the system integrates Ethers.js and includes robust security (ECDSA, key rotation, reentrancy protection) to safeguard funds.'],
              ['2.3. Profit Distribution Workflow', 'Distributions are initiated by the owner, calculated off-chain, and claimed via signed messages. Only verified claims are accepted, and transfers are protected against reentrancy.'],
              ['2.4. Security Considerations', 'The system includes ECDSA signature checks, backend key rotation, exclusion of owner from claims, and safe transfer logic—all contributing to a trustworthy token economy.']
            ].map(([subtitle, text], idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.85)' }}>
                <strong>{subtitle}</strong><br />{text}
              </Typography>
            ))}
          </>
        )
      },
      {
        title: '3. Market Analysis: Real Estate Investment Opportunities',
        body: (
          <>
            {[
              ['3.1. Syria', 'Avg. price: $15,000, rent: $150–$1,000/mo. ROI: 12% (long-term), 60% (short-term)'],
              ['3.2. Egypt', 'Avg. price: $70,430, rent: $462.80–$535/mo. ROI: 7.88% (long), 9.11% (short)'],
              ['3.3. Turkey', 'Avg. price: $99,372, rent: $476–$696/mo. ROI: 5.75% (long), 8.41% (short)'],
              ['3.4. United States', 'Avg. price: $371,300, rent: $1,703–$2,000+/mo. ROI: 5.50% (long), 6.47% (short)'],
              ['3.5. Germany', 'Avg. price: $379,773, rent: $990–$2,473/mo. ROI: 3.13% (long), 7.82% (short)']
            ].map(([region, stats], idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.85)' }}>
                <strong>{region}</strong><br />{stats}
              </Typography>
            ))}
          </>
        )
      },
      {
        title: '4. Return on Investment (ROI) Comparison',
        body: (
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>
            ROI = annual rent ÷ property price. Syria leads (12–60%), followed by Egypt and Turkey. USA and Germany are used as benchmarks for stability but offer lower returns.
          </Typography>
        )
      },
      {
        title: '5. Core Business Model',
        body: (
          <>
            {[
              ['Phase 1: Renovation of Existing Properties in Syria', 'The initial phase focuses on acquiring undervalued properties in Syria that need renovation. Our engineering team renovates them affordably, and the units are rented to locals, aid workers, and early returnees. Income is distributed to LND holders via smart contracts.'],
              ['Phase 2: Expansion & New Construction', 'Once stable income is achieved, we purchase land in high-potential areas and develop new residential or mixed-use buildings. These new assets are either rented or sold, with profits reinvested or distributed to token holders.']
            ].map(([phase, description], idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.85)' }}>
                <strong>{phase}</strong><br />{description}
              </Typography>
            ))}
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
              The two-phase approach enables sustainable growth and local job creation. It also allows token holders to benefit from real estate returns without traditional barriers.
            </Typography>
          </>
        )
      },
      {
        title: '6. Conclusion',
        body: (
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>
            Landlord Token democratizes access to high-yield real estate via secure tokenomics and blockchain automation. The phased business model starts with Syrian property renovation and scales into construction and new markets like Egypt and Turkey. It offers strong ROI and social impact, merging profitability with purpose.
          </Typography>
        )
      }
    ].map(({ title, body }, i) => (
      <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 + i * 0.1 }}>
        <Box sx={{ ...sectionBoxStyle, maxWidth: 900 }}>{/* Section Card */}
          <Typography variant="h4" sx={{ ...SUBTITLE_GRADIENT, fontWeight: 700, mb: 3, textAlign: 'center' }}>
            {title}
          </Typography>
          {body}
        </Box>
      </motion.div>
    ))}
  </Box>
);

export default WhitepaperSection;
