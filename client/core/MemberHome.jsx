import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Container,
  CircularProgress,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import auth from "../lib/auth-helper";
import { list } from '../recipe/api-recipe';
import defaultRecipeImage from "../src/assets/defaultFoodImage.png";
import burger from "../src/assets/BurgerHero1.png";

const RecipeCarousel = ({ featuredRecipes, handleViewRecipe, getImageUrl }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setScrollPosition(container.scrollLeft + scrollAmount);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        setScrollPosition(container.scrollLeft);
      };
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollRight(container.scrollWidth > container.clientWidth);
    }
  }, [featuredRecipes]);

  const canScrollLeft = scrollPosition > 0;

  return (
    <div
      style={{ position: "relative", overflow: "hidden", padding: "0 40px" }}
    >
      <IconButton
        sx={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          backgroundColor: "background.paper",
          boxShadow: 2,
          "&:hover": { backgroundColor: "action.hover" },
          display: canScrollLeft ? "flex" : "none",
        }}
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
      >
        <ChevronLeft />
      </IconButton>
      <div
        ref={scrollContainerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
          scrollBehavior: "smooth",
        }}
      >
        {featuredRecipes && featuredRecipes.length > 0 ? (
          featuredRecipes.map((recipe) => (
            <div
              key={recipe.id || recipe._id}
              style={{
                minWidth: 300,
                maxWidth: 300,
                margin: "8px",
                flexShrink: 0,
              }}
            >
              <Card sx={{ height: "auto", backgroundColor: "#f2f0ef" }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={recipe.image}
                  alt={recipe.title}
                  onError={() => handleImageError(recipe._id)}
                  sx={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    flexGrow: 1
                  }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ mb: 1 }}
                  >
                    {recipe.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1  }}
                  >
                    Prep: {recipe.preptime} min | Cook: {recipe.cooktime} min |
                    Serves: {recipe.servings}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewRecipe(recipe)}
                    fullWidth
                    sx={{
                      mt: 2,
                      border: "1px solid #000000",
                      backgroundColor: "#000000",
                      "&:hover": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  >
                    VIEW RECIPE
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <Typography
          variant="h6"
          align="center"
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          No recipes available. Try adding some!
        </Typography>
        )}
      </div>
      <IconButton
        sx={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          backgroundColor: "background.paper",
          boxShadow: 2,
          "&:hover": { backgroundColor: "action.hover" },
          display: canScrollRight ? "flex" : "none",
        }}
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
      >
        <ChevronRight />
      </IconButton>
    </div>
  );
};

export default function MemberHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayCount, setDisplayCount] = useState(8); // New state variable
  const [debug, setDebug] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const getImageUrl = useCallback((recipe) => {
    if (recipe.image && recipe.image.data && recipe.image.contentType) {
      let imageData;
      if (typeof recipe.image.data === 'string') {
        imageData = recipe.image.data;
      } else if (typeof recipe.image.data === 'object' && recipe.image.data.type === 'Buffer') {
        // Convert Buffer data to base64 string
        imageData = btoa(String.fromCharCode.apply(null, recipe.image.data.data));
      } else {
        console.error('Unexpected image data format:', recipe.image.data);
        return defaultRecipeImage;
      }
      return `data:${recipe.image.contentType};base64,${imageData}`;
    }
    return defaultRecipeImage;
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const jwt = auth.isAuthenticated();

    if (jwt) {
      fetchRecipes(jwt, signal);
    }

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const fetchRecipes = async (jwt, signal) => {
    try {
      setIsLoading(true);
      const data = await list({ t: jwt.token }, signal);
      if (data && data.error) {
        setError(data.error);
      } else {
        // Construct full image URL for user-uploaded images, or use default image
        const dbRecipes = data.map((recipe) => ({
          ...recipe,   
          image: getImageUrl(recipe),
          //isDefault: false,
        }));
        const sortedRecipes = dbRecipes.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );
        setFeaturedRecipes(sortedRecipes.slice(0, 8));
        setAllRecipes(sortedRecipes);
        setFilteredRecipes(sortedRecipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("Could not load recipes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = allRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
    setDisplayCount(8);
    setIsSearching(true);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === "") {
      setFilteredRecipes(allRecipes);
      setDisplayCount(8);
      setIsSearching(false);
    } else {
      handleSearch(e);
    }
  };

  const handleViewRecipe = (recipe) => {
    navigate(`/viewrecipe?id=${recipe._id}`, { state: { from: location.pathname } });
  }

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 8);
  };

  if (isLoading) {
    return (
      <Container
        component="main"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    console.error("Error in MemberHome:", error);
    return (
      <Container component="main">
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }


  return (
    <div style={{ backgroundColor: "#FFF4EA" }}>
      <Container component="main" maxWidth="lg" sx={{ width: "80%" }}>
        <section>
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Delicious Recipes
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Find and share the best recipes from around the world
          </Typography>
          <form onSubmit={handleSearch}>
            <TextField
              type="search"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                border: "1px solid #000000",
                backgroundColor: "#000000",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                },
              }}
            >
              Search
            </Button>
          </form>
        </section>

        {!isSearching && (
          <section>
            <Typography variant="h4" component="h2" gutterBottom>
              Latest Recipes
            </Typography>
            <RecipeCarousel
              featuredRecipes={featuredRecipes}
              handleViewRecipe={handleViewRecipe}
              getImageUrl={getImageUrl}
            />
          </section>
        )}

        <section style={{ marginTop: "2rem" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {isSearching ? "Search Results" : "All Recipes"}
          </Typography>
          <Grid container spacing={3}>
            {filteredRecipes.slice(0, displayCount).map((recipe) => (
              <Grid item xs={12} sm={6} md={3} key={recipe.id || recipe._id}>
                <Card sx={{ height: 350, display: 'flex', flexDirection: 'column'}}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={recipe.image}
                    alt={recipe.title}
                  />
                  <CardContent sx={{ p: 2, background: "#f2f0ef", display: 'flex', flexGrow: 1, flexDirection: 'column'  }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ mb: 1 }}
                    >
                      {recipe.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        mb: 1, 
                        flexGrow: 1, 
                        fontSize: 'clamp(0.65rem, 2vw, 0.85rem)',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      Prep: {recipe.preptime} min | Cook: {recipe.cooktime} min
                      | Serves: {recipe.servings}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewRecipe(recipe)}
                      fullWidth
                      sx={{
                        mt: 'auto',
                        border: "1px solid #000000",
                        backgroundColor: "#000000",
                        "&:hover": {
                          backgroundColor: "#FFFFFF",
                        },
                      }}
                    >
                      VIEW RECIPE
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {displayCount < filteredRecipes.length && ( // Load More button
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoadMore}
              fullWidth
              sx={{
                mt: 2,
                border: "1px solid #000000",
                backgroundColor: "#000000",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                },
              }}
            >
              Load More
            </Button>
          )}
          {filteredRecipes.length === 0 && (
            <Typography
              variant="body1"
              align="center"
              style={{ marginTop: "2rem" }}
            >
              {isSearching 
                ? "No recipes found matching your search." 
                : "No recipes available. Try adding some!"}
            </Typography>
          )}
        </section>
        <section style={{paddingTop: 20, paddingBottom: 20}}>
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
                Ready to get started?
              </Typography>
              <Typography variant="body1" sx={{ color: "#4A4A4A" }}>
              Whether you're looking to find new recipes, share your own, or connect with fellow food lovers, FreshPlate is here to make your culinary journey more exciting and accessible.
              </Typography>
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
      </Container>
    </div>
  );
}