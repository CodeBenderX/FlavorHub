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
import aboutByron from "../src/assets/react.svg";
import aboutKunai from "../src/assets/react.svg";
import aboutBhuvnesh from "../src/assets/react.svg";

export default function AboutPage() {
  return (
    // edited the width to make it ocuppy 80% of the page contained them in div so it will contain the background
    <div style={{ backgroundColor: "#whitesmoke" }}>
      <Box sx={{ width: "80%", margin: "auto", padding: 4 }}>
        {" "}
        {/* Full-page layout */}
        {/* About FreshPlate Heading */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ color: "red" }}
        >
          About <img src={logo} alt="FreshPlate Logo" style={{ width: 180 }} />
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
            Welcome to{" "}
            <strong>
              <span style={{ color: "red" }}>FlavorHub</span>
            </strong>{" "}
            – your ultimate culinary companion! Whether you're a seasoned chef
            or a kitchen novice, we’re here to ignite your creativity and help
            you craft fresh, delicious meals with ease.
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
              At{" "}
              <strong>
                <span style={{ color: "red" }}>FlavorHub</span>
              </strong>
              , we believe cooking should be fresh, fun, and effortless. That’s
              why we’ve created a space where you can explore diverse recipes,
              share your own culinary masterpieces, and find inspiration to take
              your cooking to the next level.
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
              sx={{
                borderRadius: "8px",
                maxWidth: "80%",
                height: "auto",
                boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.58)",
              }}
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
              sx={{
                borderRadius: "8px",
                maxWidth: "80%",
                height: "auto",
                boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.58)",
              }}
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
              <strong>
                <span style={{ color: "red" }}>FlavorHub</span>
              </strong>{" "}
              was born from a passion for home cooking and a desire to make
              sharing and discovering great food effortless. What began as a
              simple idea to organize our favorite recipes has evolved into a
              vibrant platform where cooks of all levels can connect, learn, and
              grow together.
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
              themselves, and <strong>
                <span style={{ color: "red" }}>FlavorHub</span>
              </strong>{" "} is here to guide you along the way.
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
              sx={{
                borderRadius: "8px",
                maxWidth: "80%",
                height: "auto",
                boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.58)",
              }}
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
            sx={{ marginTop: 3, paddingX: 4 }}
          >
            {[
              {
                name: "Angelo Tiquio",
                image: aboutAngelo,
              },
              {
                name: "Lorenzo Menil Jr.",
                image: aboutLorenzo,
              },
              {
                name: "Bianca Salunga",
                image: aboutBianca,
              },
              {
                name: "Byron Ho",
                image: aboutByron,
              },
              {
                name: "Kunai Chyngyzbekova",
                image: aboutKunai,
              },
              {
                name: "Bhuvnesh Bhardwaj",  
                image: aboutBhuvnesh,
              },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    padding: 2,
                    borderRadius: 2,
                    opacity: 0,
                    transform: "translateY(20px)",
                    animation: "fadeInUp 0.6s ease-out forwards",
                    "@keyframes fadeInUp": {
                      "0%": { opacity: 0, transform: "translateY(20px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
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
