import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  TextField,
  Container,
  Grid2,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import image1 from "../src/assets/FriedPorkBelly.png";
import image2 from "../src/assets/GrilledSquid.png";
import image3 from "../src/assets/BakedSalmonwithVeg.png";
import image4 from "../src/assets/BakedHam.png";
import image5 from "../src/assets/ShrimpPasta.png";
import image6 from "../src/assets/StrawberryCake.png";
import burger from "../src/assets/BurgerHero1.png";

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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div style={{backgroundColor:'#fff4ea'}}>
      <Container component="main" >
        <section>
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Delicious Recipes
          </Typography>
          <Card
            sx={{
              display: "flex",
              maxWidth: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
            }}
          >
            <CardContent
              sx={{
                flex: "1 0 50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "32px",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#1A1A1A",
                }}
              >
                Join us today and discover delicious Recipes.
              </Typography>
              <Typography variant="body1" sx={{ color: "#4A4A4A" }}>
                Share your recipes, get inspired, and connect with food lovers.
              </Typography>
              <Link to="/signup">
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#1A1A1A",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#333333",
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
                width: "35%",
                objectFit: "cover",
                objectPosition: "center",
                transform: "scaleX(1.2)",
              }}
              image={burger}
              alt="Delicious burger with fresh vegetables"
            />
          </Card>
        </section>

        <section>
          <Typography variant="h4" component="h2" gutterBottom>
            Sign up to view the recipes!
          </Typography>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid2
              container
              spacing={4}
              justifyContent="center"
              alignItems="stretch"
            >
              {featuredRecipes && featuredRecipes.length > 0 ? (
                featuredRecipes.map((recipe) => (
                  <Grid2
                    item
                    xs={12}
                    sm={6}
                    md={4}
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
                      }}
                    >
                      <Box
                        sx={{
                          width: 335,
                          height: 150, // Fixed height for all images
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
                          p: 3,
                          bgcolor: "white",
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            mb: 2,
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
                  </Grid2>
                ))
              ) : (
                <Grid2 item xs={12}>
                  <Typography variant="body1" align="center">
                    No recipes available at the moment.
                  </Typography>
                </Grid2>
              )}
            </Grid2>
          </Container>
        </section>
      </Container>
    </div>
  );
}
