import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  IconButton,
  Pagination,
  PaginationItem,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ChevronRight,
  BrokenImage,
} from "@mui/icons-material";
import auth from "../lib/auth-helper";
import { remove } from "./api-recipe";
import defaultRecipeImage from "../src/assets/defaultFoodImage.png";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try refreshing the page.</h1>;
    }

    return this.props.children;
  }
}

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    recipeId: null,
  });
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    message: "",
    title: "",
  });
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = auth.isAuthenticated()?.user || {};

  const params = new URLSearchParams(location.search);
  const creatorQuery = params.get("creator");

  const handleEditRecipe = (recipeId) => {
    navigate(`/editrecipe?id=${recipeId}`);
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/viewrecipe?id=${recipeId}`, {
      state: { from: `${location.pathname}${location.search}`, },
    });
  };

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const jwt = auth.isAuthenticated();
      if (!jwt) {
        throw new Error("User not authenticated");
      }
      let url = "";
      if (creatorQuery) {
        url = `/api/recipes/creator/${encodeURIComponent(creatorQuery)}`;
      } else {
        url = "/api/recipes";
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
       
    const sortedData = data.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    )
      if (!creatorQuery) {
       
        const userRecipes = data.filter(
          (recipe) => recipe.creator === jwt.user.name
        );
      setRecipes(userRecipes);
      setTotalPages(Math.ceil(userRecipes.length / itemsPerPage));
    } else {
      
      setRecipes(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    }
    setError(null);
  } catch (err) {
    setError("Failed to load recipes. Please try again later.");
    console.error("Error fetching recipes:", err);
  } finally {
    setLoading(false);
  }
}, [itemsPerPage, creatorQuery, location.search]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.get("added") === "true") {
      setConfirmationDialog({
        open: true,
        title: "Recipe Added",
        message: "Your recipe has been successfully added.",
      });
      params.delete("added");
      const newSearch = params.toString();
      navigate(`${location.pathname}${newSearch ? "?" + newSearch : ""}`, { replace: true });
    }
  }, [location]);

  const handleDeleteRecipe = useCallback(async () => {
    const recipeId = deleteDialog?.recipeId;
    if (!recipeId) return;

    const jwt = auth.isAuthenticated();
    try {
      await remove({ recipeId: recipeId }, { t: jwt.token });
      setDeleteDialog({ open: false, recipeId: null });
      setConfirmationDialog({
        open: true,
        title: "Recipe Deleted",
        message: "Your recipe has been successfully deleted.",
      });
      await fetchRecipes();
      const remainingRecipes = recipes.filter(
        (recipe) => recipe._id !== recipeId
      );
      const newTotalPages = Math.ceil(remainingRecipes.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setSnackbar({
        open: true,
        message: "Could not delete recipe. Please try again later.",
        severity: "error",
      });
    } finally {
      setDeleteDialog({ open: false, recipeId: null });
    }
  }, [deleteDialog.recipeId, fetchRecipes, recipes, currentPage, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (recipe) => {
    setDeleteDialog({ open: true, recipeId: recipe._id });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, recipeId: null });
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialog({ open: false, message: "", title: "" });
  };

  const getImageUrl = useCallback((recipe) => {
    if (recipe.image && recipe.image.data && recipe.image.contentType) {
      return `data:${recipe.image.contentType};base64,${recipe.image.data}`;
    }
    return defaultRecipeImage;
  }, []);

  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading recipes...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div style={{height: '100vh', backgroundColor:'#F9F9F9'}}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            textAlign: "center",
            color: "#DA3743",
            mb: 4,
            fontWeight: "bold",
          }}
        >
          Recipes
        </Typography>

        
        {creatorQuery && (
          <Typography variant="subtitle1" sx={{ mb: 3, textAlign: "center" }}>
            Showing recipes by: <strong>{creatorQuery}</strong>
          </Typography>
        )}

        
        {(!creatorQuery || creatorQuery === currentUser.name) && (
        <Link to="/addrecipe" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              mb: 3,
              backgroundColor: "#333",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            Add New Recipe
          </Button>
        </Link>
        )}

        {recipes.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
            You haven't created any recipes yet. Click 'Add New Recipe' to get
            started!
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {currentRecipes.map((recipe) => (
              <Card
                key={recipe._id}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #e0e0e0",
                  boxShadow: "none",
                }}
              >
                <Box sx={{ display: "flex", 
                  alignItems: "center", 
                  gap: 2,
                  flex: 1,
                  minWidth: 0, 
                  overflow: "hidden"
                }}>
                  {recipe.image && recipe.image.data ? (
                    <Avatar
                      src={getImageUrl(recipe)}
                      alt={recipe.title}
                      sx={{ width: 60, height: 60 }}
                      variant="rounded"
                      
                    />
                  ) : (
                    <Avatar
                      src={defaultRecipeImage}
                      sx={{ width: 60, height: 60, bgcolor: "grey.300" }}
                      variant="rounded"
                    ></Avatar>
                  )}
                  <Typography variant="h6" component="h2"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flex: 1,
                    }}
                  >
                    {recipe.title}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    endIcon={<ChevronRight />}
                    onClick={() => handleViewRecipe(recipe._id)}
                    sx={{ borderRadius: "4px" }}
                  >
                    View Recipe
                  </Button>
                  
                  {(recipe.creator === auth.isAuthenticated().user.name ||
                    auth.isAuthenticated().user.role === 'admin') && (
                  <>
                  <IconButton
                    size="small"
                    sx={{ border: "1px solid #e0e0e0", borderRadius: "4px" }}
                    onClick={() => handleEditRecipe(recipe._id)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    sx={{ border: "1px solid #e0e0e0", borderRadius: "4px" }}
                    onClick={() => handleOpenDeleteDialog(recipe)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  </>
                )}
                </Box>
              </Card>
            ))}
          </Box>
        )}
        {recipes.length > itemsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#333",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#444",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog
          open={deleteDialog.open}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteRecipe} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={confirmationDialog.open}
          onClose={handleCloseConfirmationDialog}
          aria-labelledby="confirmation-dialog-title"
          aria-describedby="confirmation-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title">
            {confirmationDialog.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-dialog-description">
              {confirmationDialog.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseConfirmationDialog}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
