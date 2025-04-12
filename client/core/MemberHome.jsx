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
import Box from "@mui/material/Box";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import auth from "../lib/auth-helper";
import { list, listByIngredient, listByCreator } from "../recipe/api-recipe";
import defaultRecipeImage from "../src/assets/defaultFoodImage.png";
import waffleImage from "../src/assets/waffle-registeredhome-small.png";
import bannerAds from "../src/assets/banner-ads.png";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";

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
      style={{ position: "relative", overflow: "hidden", padding: "0 20px" }}
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
          padding: "8px 0", 
        }}
      >
        {featuredRecipes && featuredRecipes.length > 0 ? (
          featuredRecipes.map((recipe) => (
            <div
              key={recipe.id || recipe._id}
              style={{
                minWidth: 280,
                maxWidth: 280,
                margin: "0 8px",
                flexShrink: 0,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#f2f0ef",
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={recipe.image}
                  alt={recipe.title}
                  onError={() => handleImageError(recipe._id)}
                  sx={{
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                    flexGrow: 1,
                  }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      mb: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {recipe.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
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
            sx={{
              marginTop: "2rem",
              marginBottom: "2rem",
              minWidth: "100%",
            }}
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
  const [displayCount, setDisplayCount] = useState(8); 
  const [debug, setDebug] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const getImageUrl = useCallback((recipe) => {
    if (typeof recipe.image === "string" && recipe.image.startsWith("data:")) {
      return recipe.image;
    }
    if (recipe.image && recipe.image.data && recipe.image.contentType) {
      let imageData;
      if (typeof recipe.image.data === "string") {
        imageData = recipe.image.data;
      } else if (
        typeof recipe.image.data === "object" &&
        recipe.image.data.type === "Buffer"
      ) {
        imageData = btoa(
          String.fromCharCode.apply(null, recipe.image.data.data)
        );
      } else {
        console.error("Unexpected image data format:", recipe.image.data);
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
        
        const dbRecipes = data.map((recipe) => ({
          ...recipe,
          image: getImageUrl(recipe),
          
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

  const performSearch = async (query) => {
    const jwt = auth.isAuthenticated();
    if (!query.trim()) {
      setFilteredRecipes(allRecipes);
      setIsSearching(false);
      return;
    }
    try {
      setIsLoading(true);
      const [ingredientData, creatorData] = await Promise.all([
        listByIngredient({ ingredient: query }, jwt.token),
        listByCreator({ name: query }, jwt.token),
      ]);

      const backendIngredientResults = Array.isArray(ingredientData)
        ? ingredientData
        : [];
      const backendCreatorResults = Array.isArray(creatorData)
        ? creatorData
        : [];

      const localResults = allRecipes.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          (r.description &&
            r.description.toLowerCase().includes(query.toLowerCase())) ||
          (r.category && r.category.toLowerCase().includes(query.toLowerCase()))
      );

      const merged = [
        ...new Map(
          [
            ...backendIngredientResults,
            ...backendCreatorResults,
            ...localResults,
          ].map((item) => [item._id, item])
        ).values(),
      ];

      const finalResults = merged.map((r) => ({
        ...r,
        image: getImageUrl(r),
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/member?search=${encodeURIComponent(searchQuery)}`);
      performSearch(searchQuery);
    } else {
      navigate(`/member`);
      setFilteredRecipes(allRecipes);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("search");
    if (queryParam && allRecipes.length > 0) {
      setSearchQuery(queryParam);
      performSearch(queryParam);
    } else if (!queryParam && allRecipes.length > 0) {
      
      setFilteredRecipes(allRecipes);
      setIsSearching(false);
    }
  }, [location.search, allRecipes]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      navigate(`/member`);
      setFilteredRecipes(allRecipes);
      setIsSearching(false);
    }
  };

  const handleViewRecipe = (recipe) => {
    
    navigate(`/viewrecipe?id=${recipe._id}`, { state: { from: location } });
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 8);
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
        <CircularProgress data-testid="loading-spinner" />
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
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          width: { xs: "95%", md: "90%", lg: "80%" },
          px: { xs: 0, sm: 2 }, 
        }}
      >
        <section>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "300px", sm: "350px", md: "400px" },
              mb: 4,
            }}
          >
            <CardMedia
              component="img"
              image={bannerAds}
              alt="Banner Image"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: "white",
                  mb: 0,
                  lineHeight: 1.5,
                  fontSize: { xs: "1.3rem", sm: "2.5rem", md: "3rem" }, 
                  fontStyle: "bold",
                }}
              >
                Discover Delicious Recipes
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  color: "white",
                  mt: 1,
                  mb: 1,
                  lineHeight: 1.2,
                  fontSize: { xs: ".8rem", sm: "1.25rem", md: "1.5rem" },
                  textAlign: "center",
                  padding: "0 20px",
                }}
              >
                Find and share the best recipes from around the world
              </Typography>

              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  width: "80%",
                  maxWidth: "600px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search recipes, ingredients, recipe owner or category"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    "& .MuiInputBase-input::placeholder": {
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      whiteSpace: "normal",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      opacity: 1,
                      color: "text.secondary",
                      whiteSpace: "normal", 
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    },
                    "& .MuiInputBase-root": {
                      height: "auto", 
                      minHeight: 56, 
                      alignItems: "flex-start", 
                      paddingBottom: { xs: "20px", sm: "5px" }, 
                    },
                  }}
                  InputProps={{
                    endAdornment: searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setSearchQuery("");
                            navigate(`/member`);
                            setFilteredRecipes(allRecipes);
                            setIsSearching(false);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 4,
                    backgroundColor: "#DA3743",
                    border: "1px solid #DA3743",
                    borderRadius: 25,
                    fontSize: { xs: ".7rem", sm: "1rem", md: "1.2rem" },
                    "&:hover": {
                      backgroundColor: "#FFFFFF",
                      color: "#DA3743",
                    },
                  }}
                >
                  Find Your Favourite Recipes
                </Button>
              </Box>
            </Box>
          </Box>
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
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            {isSearching ? "Search Results" : "All Recipes"}
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {filteredRecipes.slice(0, displayCount).map((recipe) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={recipe.id || recipe._id}
              >
                <Card
                  sx={{
                    height: { xs: 300, sm: 350 },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 140, sm: 180, md: 200 },
                      objectFit: "cover",
                    }}
                    image={recipe.image}
                    alt={recipe.title}
                  />

                  <CardContent
                    sx={{
                      p: 2,
                      background: "#f2f0ef",
                      display: "flex",
                      flexGrow: 1,
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        mb: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {recipe.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        flexGrow: 1,
                        fontSize: "clamp(0.65rem, 2vw, 0.85rem)",
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
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
                        mt: "auto",
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
          {displayCount < filteredRecipes.length && ( 
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoadMore}
              fullWidth
              sx={{
                mt: 2,
                py: { xs: 1, sm: 1.5 }, 
                border: "1px solid #DA3743",
                color: "#DA3743",
                backgroundColor: "transparent",
                fontSize: { xs: "0.875rem", sm: "1rem" },
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
        <section style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
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
                padding: { xs: "20px", md: "32px" },
                order: { xs: 2, md: 1 },
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#1A1A1A",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Ready to get started?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#4A4A4A",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Whether you're looking to find new recipes, share your own, or
                connect with fellow food lovers, FreshPlate is here to make your
                culinary journey more exciting and accessible.
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{
                width: { xs: "100%", md: "35%" },
                height: { xs: "200px", md: "auto" },
                objectFit: "cover",
                objectPosition: "center",
                order: { xs: 1, md: 2 },
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
