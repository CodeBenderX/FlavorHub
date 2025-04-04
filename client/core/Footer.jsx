import React, { useState } from "react";
import { Typography, Container, Box, Grid, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../src/assets/FreshPlate-logo.png";

export default function Footer() {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error("Failed to load teamlogo.png");
    setImageError(true);
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f9f9f9",
        color: "#333",
        py: { xs: 3, md: 4 },
        px: { xs: 2, sm: 0 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Logo and Copyright Section */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" color="#FF6E1C" sx={{ display: 'inline-flex' }}>
                <img 
                  src={logo} 
                  alt="FlavorHub-Logo" 
                  style={{ 
                    height: 'auto', 
                    maxWidth: '180px',
                    width: '100%' 
                  }} 
                />
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} FlavorHub. All rights reserved.
            </Typography>
          </Grid>
          
          {/* Quick Links Section */}
          <Grid item xs={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#DA3743', 
                fontWeight: 'bold',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Quick Links
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 1
              }}
            >
              <MuiLink component={Link} to="/about" color="inherit" underline="hover">
                About Us
              </MuiLink>
              <MuiLink component={Link} to="/contact" color="inherit" underline="hover">
                Contact Us
              </MuiLink>
            </Box>
          </Grid>
          
          {/* Social Links Section */}
          <Grid item xs={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#DA3743', 
                fontWeight: 'bold',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Follow Us
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 1
              }}
            >
              <MuiLink href="https://facebook.com" color="inherit" underline="hover">
                Facebook
              </MuiLink>
              <MuiLink href="https://twitter.com" color="inherit" underline="hover">
                Twitter
              </MuiLink>
              <MuiLink href="https://instagram.com" color="inherit" underline="hover">
                Instagram
              </MuiLink>
            </Box>
          </Grid>
        </Grid>
        
        {/* Bottom Copyright */}
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            This Website is Designed by{' '}
            <Link 
              to="/about" 
              style={{ 
                color: '#DA3743', 
                fontWeight: 'bold', 
                textDecoration: 'none' 
              }}
            >
              PseudoSquad
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}