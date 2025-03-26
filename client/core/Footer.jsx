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
        bgcolor: "#f9f9f9", // Light background color
        color: "#333", // Dark text color
        py: 4,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
          <Typography variant="h6" color="#FF6E1C" sx={{ flexGrow: 1 }}>
              <img src={logo} alt="FlavorHub-Logo" height={20} />
          </Typography>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} FlavorHub. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom style={{color: '#DA3743', fontWeight: 'bold'}}>
              Quick Links
            </Typography>
            <Box>
              <MuiLink component={Link} to="/about" color="inherit" underline="hover">
                About Us
              </MuiLink>
            </Box>
            <Box>
              <MuiLink component={Link} to="/contact" color="inherit" underline="hover">
                Contact Us
              </MuiLink>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom style={{color: '#DA3743', fontWeight: 'bold'}}>
              Follow Us
            </Typography>
            <Box>
              <MuiLink href="https://facebook.com" color="inherit" underline="hover">
                Facebook
              </MuiLink>
            </Box>
            <Box>
              <MuiLink href="https://twitter.com" color="inherit" underline="hover">
                Twitter
              </MuiLink>
            </Box>
            <Box>
              <MuiLink href="https://instagram.com" color="inherit" underline="hover">
                Instagram
              </MuiLink>
            </Box>
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            This Website is Designed by <Link to="/about" style={{ color: '#DA3743', fontWeight: 'bold', textDecoration: 'none' }}>PseudoSquad</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
