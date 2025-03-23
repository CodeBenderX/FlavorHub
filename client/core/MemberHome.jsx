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
import { list, listByIngredient, listByCreator } from '../recipe/api-recipe';
import defaultRecipeImage from "../src/assets/defaultFoodImage.png";
import waffleImage from "../src/assets/waffle-registeredhome-small.png";

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
    // If the image is already a valid data URL, return it
  if (typeof recipe.image === 'string' && recipe.image.startsWith("data:")) {
    return recipe.image;
  }
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

  // 4) The function that actually does the search logic (backend + local)
  const performSearch = async (query) => {
    const jwt = auth.isAuthenticated();
    if (!query.trim()) {
      // Empty query => show all recipes
      setFilteredRecipes(allRecipes);
      setIsSearching(false);
      return;
    }
    try {
      setIsLoading(true);
      const [ingredientData, creatorData] = await Promise.all([
        listByIngredient({ ingredient: query }, jwt.token),
        listByCreator({ name: query }, jwt.token)
      ]);

      const backendIngredientResults = Array.isArray(ingredientData) ? ingredientData : [];
      const backendCreatorResults = Array.isArray(creatorData) ? creatorData : [];

      // Local filter
      const localResults = allRecipes.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(query.toLowerCase()))
      );

      // Merge & remove duplicates
      const merged = [
        ...new Map(
          [...backendIngredientResults, ...backendCreatorResults, ...localResults].map(item => [item._id, item])
        ).values()
      ];

      // Convert images
      const finalResults = merged.map(r => ({
        ...r,
        image: getImageUrl(r)
      }));
      setFilteredRecipes(finalResults);
      setIsSearching(true);
    } catch (err) {
      console.error("Error searching recipes:", err);
      setError("Error searching recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

   // 5) The form submission handler: updates the URL with ?search=...
   const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Suppose your route is /member
      navigate(`/member?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // If empty, remove any query param
      navigate(`/member`);
    }
  };

  // 6) On mount or whenever the URL changes, read the query param & run search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("search");
    if (queryParam && allRecipes.length > 0) {
      setSearchQuery(queryParam);
      performSearch(queryParam);
    } else if (!queryParam && allRecipes.length > 0) {
      // If no search param => show all
      setFilteredRecipes(allRecipes);
      setIsSearching(false);
    }
  }, [location.search, allRecipes]);

  // 1. In handleSearchInputChange, just update searchQuery:
const handleSearchInputChange = (e) => {
  setSearchQuery(e.target.value);
};

const handleViewRecipe = (recipe) => {
  // Pass the entire location, including ?search=...
  navigate(`/viewrecipe?id=${recipe._id}`, { state: { from: location } });
};

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
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <Container component="main" maxWidth="lg" sx={{ width: "80%" }}>
        <section>
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Delicious Recipes
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Find and share the best recipes from around the world
          </Typography>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              type="search"
              placeholder="Search recipes, ingredients or creators"
              value={searchQuery}
              //onChange={handleSearchInputChange}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                border: "1px solid #DA3743",
                backgroundColor: "#DA3743",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                },
              }}
            >
              Find Your Favourite Recipes
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
                border: "1px solid #DA3743",
                color: "#DA3743",
                backgroundColor: "transparent",
                "&:hover": {
                  color: "white !important",
                  backgroundColor: "#DA3743",
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
              image={waffleImage}
              alt="Delicious waffle with fresh fruits"
            />
          </Card>
        </section>
      </Container>
    </div>
  );
}