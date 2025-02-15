import React from "react";
import { Typography, Grid, Box, colors, emphasize } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import communityMeal from "../src/assets/communityMeal.png";
import cookingTogether from "../src/assets/cookingTogether.png";
import familyCookingTogether from "../src/assets/familyCookingTogether.png";
import logo from "../src/assets/FreshPlate-logo.png"; // Import FreshPlate logo
import aboutAngelo from "../src/assets/Aboutus-Angelo.jpg";
import aboutLorenzo from "../src/assets/Aboutus-Lorenzo.jpg";
import aboutBianca from "../src/assets/Aboutus-Bianca.jpeg";
import aboutOvo from "../src/assets/Aboutus-Ovo.jpeg";

export default function AboutPage() {
  return (
    // edited the width to make it ocuppy 80% of the page contained them in div so it will contain the background
    <div style={{ backgroundColor: "#FFF5EB" }}>
      <Box sx={{ width: "80%", margin: "auto", padding: 4 }}>
        {" "}
        {/* Full-page layout */}
        {/* Logo Above Heading */}
        <Box sx={{ textAlign: "center", marginBottom: 2 }}>
          <img src={logo} alt="FreshPlate Logo" style={{ width: 120 }} />
        </Box>
        {/* About FreshPlate Heading */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ color: "#FF7043" }}
        >
          About FreshPlate
        </Typography>
        <Box
          sx={{
            maxWidth: 800,
            margin: "auto",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          <Typography variant="body1" sx={{ color: "#4A4A4A" }}>
            <strong>Welcome to FreshPlate</strong> – your ultimate destination
            for all things cooking! Whether you're a seasoned chef or a beginner
            in the kitchen, we’re here to inspire your culinary creativity and
            help you make fresh, delicious meals from the comfort of your home.
          </Typography>
        </Box>
        {/* About FreshPlate Section */}
        <Grid container spacing={4} sx={{ paddingX: 4, alignItems: "center" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            <Typography variant="body1" sx={{ color: "#4A4A4A" }}>
              At FreshPlate, we believe that food should be fresh, fun, and easy
              to create. That's why we’ve built a space where you can explore a
              wide variety of recipes, share your own culinary creations, and
              discover new ideas to elevate your cooking game.
            </Typography>
            <br></br>
            <Typography variant="body1" sx={{ color: "#4A4A4A" }}>
              Our mission is to bring people together through the joy of food,
              one recipe at a time.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center", padding: "8px" }}
          >
            <CardMedia
              component="img"
              image={communityMeal}
              alt="Community Meal"
              sx={{ borderRadius: "8px", maxWidth: "80%", height: "auto" }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center", padding: "8px" }}
          >
            <CardMedia
              component="img"
              image={cookingTogether}
              alt="Cooking Together"
              sx={{ borderRadius: "8px", maxWidth: "80%", height: "auto" }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            <Typography variant="body1" sx={{ color: "#4A4A4A" }}>
              FreshPlate was born out of a love for home cooking and the desire
              to make it easier for people to share and discover great food.
              What started as a small idea to organize and share our favorite
              recipes quickly grew into a platform where cooks of all levels
              could contribute, learn, and grow together.
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            <Typography variant="body1" sx={{ color: "#4A4A4A" }}>
              We’re passionate about fostering a positive and supportive
              environment where everyone—from novice cooks to experienced
              chefs—can feel confident experimenting with new flavors,
              techniques, and ingredients.
            </Typography>
            <br></br>
            <Typography variant="body1" sx={{ color: "#4A4A4A" }}>
              The kitchen is a place for everyone to explore and express
              themselves, and FreshPlate is here to guide you along the way.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center", padding: "8px" }}
          >
            <CardMedia
              component="img"
              image={familyCookingTogether}
              alt="Family Cooking Together"
              sx={{ borderRadius: "8px", maxWidth: "80%", height: "auto" }}
            />
          </Grid>
        </Grid>
        {/* Meet the Team Section */}
        <Box sx={{ marginTop: 6 }}>
          <Typography
            variant="h5"
            textAlign={"left"}
            width={"100%"}
            margin={"auto"}
            gutterBottom
            sx={{ color: "#4A4A4A" }}
          >
            ★ Meet the Team:{" "}
            <span style={{ color: "#FF7043", fontWeight: "bold" }}>
              Pseudo Squad
            </span>
          </Typography>

          <Grid
            container
            spacing={2}
            justifyContent="center"
            width={"100%"}
            sx={{ marginTop: 3, paddingX: 4}}
          >
            {[
              {
                name: "Angelo Tiquio",
                role: "Lead Frontend Developer",
                image: aboutAngelo,
              },
              {
                name: "Lorenzo Menil Jr.",
                role: "Lead Backend Developer",
                image: aboutLorenzo,
              },
              {
                name: "Bianca Salunga",
                role: "QA/UI Designer",
                image: aboutBianca,
              },
              {
                name: "Ovovwero Unuavwodo",
                role: "Frontend Developer",
                image: aboutOvo,
              },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: "center", padding: 2, borderRadius: 2 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      overflow: "hidden",
                      margin: "auto",
                      marginBottom: 2,
                    }}
                  >
                    <img
                      src={member.image}
                      alt={`${member.name}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Typography variant="h6">{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
