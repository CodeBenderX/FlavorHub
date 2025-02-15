import React, { useState }  from "react";
import { Typography, Container, Box } from "@mui/material";
import teamlogo from '../src/assets/teamlogo.png';


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
        height:"auto",
        bgcolor: "#fdfdfd",
        py: 4,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          gutterBottom
        >
          &copy; {new Date().getFullYear()} FreshPlate. All rights reserved.
        </Typography>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ textAlign: "center" }}
          >
            This Website is Designed by{" "}
            {!imageError ? (
              <img
                style={{ height: 70, width: "auto", verticalAlign: "middle" }}
                src={teamlogo}
                alt="Pseudo Squad Logo"
                onError={handleImageError}
              />
            ) : (
              <span>Pseudo Squad (Image not available)</span>
            )}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
