import theme from '../theme/theme'; // Import your theme
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import HouseIcon from '@mui/icons-material/House';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CodeIcon from '@mui/icons-material/Code';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CampaignIcon from '@mui/icons-material/Campaign';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Box from '@mui/material/Box';

const TimelineSection = function() {
    // Style for the vertical connecting lines
    const connectorStyle = {
      minHeight: '50px', // Increased height for more spacing
      bgcolor: '#00BFA5', // Matching the teal color from your image
    };
  
  
  
    // Style for the timeline dots
    const timelineDotStyle = {
      bgcolor: '#00BFA5', // Teal background
      boxShadow: '0 0 30px rgba(0, 191, 165, 0.5)', // Glow effect
    };
  
    return (
      <Box sx={{ 
        color: theme.palette.primary.main,
        borderRadius: 3,
        width: { xs: '90%', md: '60%' },
      }}>
  
  
        <Timeline position="right">
          {/* 2023: Analyzing the real estate market */}
          <TimelineItem>
            <TimelineOppositeContent 
              variant="body1" 
              color="inherit"
            >
              <Typography variant="h6">2023</Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot sx={timelineDotStyle}>
                <HouseIcon sx={{ color: 'black' }} />
              </TimelineDot>
              <TimelineConnector sx={connectorStyle} />
            </TimelineSeparator>
  
            <TimelineContent >
              <Typography variant="h6" component="span">
                Analyzing the real estate market
              </Typography>
            </TimelineContent>
          </TimelineItem>
  
          {/* 2024: Finding best location in emerging markets */}
          <TimelineItem>
            <TimelineOppositeContent 
              
              variant="body1" 
              color="inherit"
            >
              <Typography variant="h6">2024</Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot sx={timelineDotStyle}>
                <LocationOnIcon sx={{ color: 'black' }} />
              </TimelineDot>
              <TimelineConnector sx={connectorStyle} />
            </TimelineSeparator>
  
            <TimelineContent >
              <Typography variant="h6" component="span">
                Finding best location in emerging markets
              </Typography>
            </TimelineContent>
          </TimelineItem>
  
          {/* 2025: Building & Testing Blockchain code */}
          <TimelineItem>
            <TimelineOppositeContent 
              
              variant="body1" 
              color="inherit"
            >
              <Typography variant="h6"> April 2025</Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot sx={timelineDotStyle}>
                <CodeIcon sx={{ color: 'black' }} />
              </TimelineDot>
              <TimelineConnector sx={connectorStyle} />
            </TimelineSeparator>
  
            <TimelineContent >
              <Typography variant="h6" component="span">
                Building & Testing Blockchain code
              </Typography>
            </TimelineContent>
          </TimelineItem>
  
          {/* May 2025: Fund Run */}
          <TimelineItem>
            <TimelineOppositeContent 
              
              variant="body1" 
              color="inherit"
            >
              <Typography variant="h6">May 2025</Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot sx={timelineDotStyle}>
                <MonetizationOnIcon sx={{ color: 'black' }} />
              </TimelineDot>
              <TimelineConnector sx={connectorStyle} />
            </TimelineSeparator>
  
            <TimelineContent >
              <Typography variant="h6" component="span">
                Fund Run
              </Typography>
            </TimelineContent>
          </TimelineItem>
  
          {/* June 2025: Coin Listing & Social Media Marketing */}
          <TimelineItem>
            <TimelineOppositeContent 
              
              variant="body1" 
              color="inherit"
            >
              <Typography variant="h6">Jun 2025</Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot sx={timelineDotStyle}>
                <CampaignIcon sx={{ color: 'black' }} />
              </TimelineDot>
              <TimelineConnector sx={connectorStyle} />
            </TimelineSeparator>
  
            <TimelineContent >
              <Typography variant="h6" component="span">
                Coin Listing & Social Media Marketing
              </Typography>
            </TimelineContent>
          </TimelineItem>
  
          {/* July 2025: First property purchase */}
          <TimelineItem>
            <TimelineOppositeContent 
              
              variant="body1" 
              color="inherit"
            >
              <Typography variant="h6">Jul 2025</Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot sx={timelineDotStyle}>
                <ApartmentIcon sx={{ color: 'black' }} />
              </TimelineDot>
              <TimelineConnector sx={connectorStyle} />
            </TimelineSeparator>
  
            <TimelineContent >
              <Typography variant="h6" component="span">
                First property purchase
              </Typography>
            </TimelineContent>
          </TimelineItem>
  
          {/* First rent distribution End of 2025 */}
          <TimelineItem>
            <TimelineOppositeContent 
              
              variant="body1" 
              color="inherit"
            >
              <Typography variant="h6">Dec 2025</Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot sx={timelineDotStyle}>
                <ApartmentIcon sx={{ color: 'black' }} />
              </TimelineDot>
              <TimelineConnector sx={connectorStyle} />
  
            </TimelineSeparator>
  
            <TimelineContent >
              <Typography variant="h6" component="span">
                First Rent Distribution on coin holders
              </Typography>
            </TimelineContent>
          </TimelineItem>
  
          {/* New plans */}
           <TimelineItem>
            <TimelineOppositeContent 
              
              variant="body1" 
              color="inherit"
            >
              <Typography variant="h6">2026</Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot sx={timelineDotStyle}>
                <HourglassBottomIcon sx={{ color: 'black' }} />
              </TimelineDot>
            </TimelineSeparator>
  
            <TimelineContent >
              <Typography variant="h6" component="span">
                Coming Soon
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>
    );
  }
  
  export default TimelineSection;
  