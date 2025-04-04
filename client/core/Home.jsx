import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  TextField,
  Container,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import image1 from "../src/assets/FriedPorkBelly.png";
import image2 from "../src/assets/GrilledSquid.png";
import image3 from "../src/assets/BakedSalmonwithVeg.png";
import image4 from "../src/assets/BakedHam.png";
import image5 from "../src/assets/ShrimpPasta.png";
import image6 from "../src/assets/StrawberryCake.png";
import bannerImage from "../src/assets/bannerImage.png";

const featuredRecipes = [
  {
    id: "1",
    title: "Fried Pork Belly",
    preptime: 30,
    cooktime: 35,
    servings: 4,
    image: image1,
  },
  {
    id: "2",
    title: "Grilled Squid",
    preptime: 20,
    cooktime: 30,
    servings: 2,
    image: image2,
  },
  {
    id: "3",
    title: "Baked Salmon with Vegies",
    preptime: 20,
    cooktime: 30,
    servings: 5,
    image: image3,
  },
  {
    id: "4",
    title: "Baked Ham",
    preptime: 10,
    cooktime: 45,
    servings: 8,
    image: image4,
  },
  {
    id: "5",
    title: "Shrimp Pasta",
    preptime: 20,
    cooktime: 45,
    servings: 6,
    image: image5,
  },
  {
    id: "6",
    title: "Strawberry Cake",
    preptime: 40,
    cooktime: 60,
    servings: 10,
    image: image6,
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <Container component="main" maxWidth="xl">
        <section style={{ marginBottom: theme.spacing(6) }}>
          <Typography
            variant={isSmallScreen ? "h4" : "h2"}
            component="h1"
            gutterBottom
            sx={{
              textAlign: isSmallScreen ? "center" : "left",
              mt: isSmallScreen ? 2 : 4,
            }}
          >
            Discover Delicious Recipes
          </Typography>
          <Card
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "column-reverse" : "row",
              maxWidth: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
              mb: 4,
            }}
          >
            <CardContent
              sx={{
                flex: isSmallScreen ? "1 1 auto" : "1 0 50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: isSmallScreen ? "24px 16px" : "32px",
                backgroundColor: "#FFF40",
                textAlign: isSmallScreen ? "center" : "left",
              }}
            >
              <Typography
                variant={isSmallScreen ? "h5" : "h4"}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#1A1A1A",
                }}
              >
                Join us today and discover delicious Recipes.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#4A4A4A", mb: isSmallScreen ? 2 : 0 }}
              >
                Share your recipes, get inspired, and connect with food lovers.
              </Typography>
              <Link
                to="/signup"
                style={{ alignSelf: isSmallScreen ? "center" : "flex-start" }}
              >
                <Button
                  variant="contained"
                  size={isSmallScreen ? "medium" : "large"}
                  sx={{
                    mt: 2,
                    backgroundColor: "#1A1A1A",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#FFFFFF",
                      color: "black !important",
                      border: "1px solid #1A1A1A",
                    },
                  }}
                >
                  Sign up now!
                </Button>
              </Link>
            </CardContent>
            <CardMedia
              component="img"
              sx={{
                width: isSmallScreen ? "100%" : isMediumScreen ? "40%" : "35%",
                height: isSmallScreen
                  ? "200px"
                  : isMediumScreen
                  ? "250px"
                  : "auto",
                objectFit: "cover",
                objectPosition: "center",
                transform: isSmallScreen ? "none" : "scaleY(1.32)",
                backgroundColor: "#FFF40",
              }}
              image={bannerImage}
              alt="Delicious burger with fresh vegetables"
            />
          </Card>
        </section>

        <section>
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h2"
            gutterBottom
            sx={{
              textAlign: isSmallScreen ? "center" : "left",
              mb: 4,
            }}
          >
            Sign up to view the recipes!
          </Typography>
          <Container maxWidth="xl" sx={{ py: isSmallScreen ? 2 : 4 }}>
            <Grid
              container
              spacing={isSmallScreen ? 2 : 4}
              justifyContent="center"
              alignItems="stretch"
            >
              {featuredRecipes && featuredRecipes.length > 0 ? (
                featuredRecipes.map((recipe) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    key={recipe.id || recipe._id}
                  >
                    <Card
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        bgcolor: "background.paper",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: isSmallScreen ? "120px" : "150px",
                          position: "relative",
                        }}
                      >
                        <Box
                          component="img"
                          src={recipe.image}
                          alt={recipe.title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          p: isSmallScreen ? 2 : 3,
                          bgcolor: "white",
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
                            fontWeight: 700,
                            mb: 1,
                            color: "text.primary",
                          }}
                        >
                          {recipe.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.875rem",
                            "& span": {
                              mx: 0.5,
                              color: "text.secondary",
                            },
                          }}
                        >
                          Prep: {recipe.preptime} min <span>|</span> Cook:{" "}
                          {recipe.cooktime} min <span>|</span> Serves:{" "}
                          {recipe.servings}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" align="center">
                    No recipes available at the moment.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Container>
        </section>
      </Container>
    </div>
  );
}
