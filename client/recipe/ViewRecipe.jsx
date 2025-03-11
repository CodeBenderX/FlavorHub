import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField, // <-- Make sure to import TextField
  Rating // <-- Import the Rating component
} from '@mui/material';
import Link from '@mui/material/Link';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import auth from "../lib/auth-helper";
import defaultRecipeImage from "../src/assets/defaultFoodImage.png";
// UPDATED: Import API helper functions for updating and deleting comments.
import { updateRecipeComment, deleteRecipeComment } from '../recipe/api-recipe';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const RenderTextWithLineBreaks = React.memo(({ text }) => {
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
});

export default function ViewRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // NEW: For adding comments (name, email, comment text, rating)
  // const [commentName, setCommentName] = useState("");
  // const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);

   // NEW: States for editing a comment
   const [editDialogOpen, setEditDialogOpen] = useState(false);
   const [selectedComment, setSelectedComment] = useState(null);
   const [editedText, setEditedText] = useState("");
   const [editedRating, setEditedRating] = useState(0);

  // For validation error dialog
  const [validationErrorDialogOpen, setValidationErrorDialogOpen] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [validationErrorField, setValidationErrorField] = useState(""); // "comment" or "rating"

  const navigate = useNavigate();
  const location = useLocation();
  const recipeId = new URLSearchParams(location.search).get('id');
  const { from } = location.state || { from: '/recipelist' };

const getImageUrl = useCallback((recipeData) => {
    if (recipeData?.image?.data && recipeData.image.contentType) {
      let imageData;
      if (typeof recipeData.image.data === 'string') {
        imageData = recipeData.image.data;
      } else if (Array.isArray(recipeData.image.data)) {
        imageData = arrayBufferToBase64(recipeData.image.data);
      } else if (typeof recipeData.image.data === 'object' && recipeData.image.data.type === 'Buffer') {
        imageData = arrayBufferToBase64(new Uint8Array(recipeData.image.data.data));
      } else {
        console.error('Unexpected image data format:', recipeData.image.data);
        return defaultRecipeImage;
      }
      return `data:${recipeData.image.contentType};base64,${imageData}`;
    }
    return defaultRecipeImage;
  }, []);

  // Get current signed in user from auth helper
  const jwt = auth.isAuthenticated();
  const currentUser = jwt ? jwt.user : {};

  // Refs for fields
  const commentRef = useRef(null);
  const ratingRef = useRef(null);

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const fetchRecipe = useCallback(async () => {
    if (!recipeId) {
      setError("No recipe ID provided");
      setLoading(false);
      return;
    }

    try {
      const jwt = auth.isAuthenticated();
      if (!jwt) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt.token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }

      const data = await response.json();
      setRecipe(data);

      // Check if current user is the creator or an admin
      setIsCreator(jwt.user.name === data.creator);
      setIsAdmin(jwt.user.role === 'admin');
      

    } catch (err) {
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleClose = useCallback(() => {
    navigate(from);
  }, [navigate, from]);

  const handleBack = useCallback(() => {
    const fromPath = location.state?.from || '/';
    navigate(fromPath);
  }, [navigate, location.state]);

  const handleEdit = useCallback(() => {
    navigate(`/editrecipe?id=${recipeId}`, { state: { from } });
  }, [navigate, recipeId, from]);

  const handleDelete = useCallback(() => {
    setDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      const jwt = auth.isAuthenticated();
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt.token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      navigate(from);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError("Failed to delete recipe. Please try again later.");
    }
    setDeleteDialog(false);
  }, [recipeId, navigate, from]);

  // NEW: Handle submit comment
  const handleSubmitComment = async () => {
    // Reset previous error
    setValidationErrorMessage("");
    // Validate comment text
    if (!commentText.trim()) {
      setValidationErrorMessage("Comment cannot be empty.");
      setValidationErrorField("comment");
      setValidationErrorDialogOpen(true);
      return;
    }
    // Validate rating (at least 1 star)
    if (!commentRating || commentRating < 1) {
      setValidationErrorMessage("Please provide a rating at least 1 star.");
      setValidationErrorField("rating");
      setValidationErrorDialogOpen(true);
      return;
    }
    try {
      const jwt = auth.isAuthenticated();
      if (!jwt) {
        throw new Error("User not authenticated");
      }

       // POST to your backend endpoint for adding a comment
       const response = await fetch(`/api/recipes/${recipeId}/comments`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.token,
        },
        body: JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
          text: commentText,
          rating: commentRating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      // Expect the updated recipe with new comment in the response
      const updatedRecipe = await response.json();
      setRecipe(updatedRecipe);
      // Clear the form
      // setCommentName("");
      // setCommentEmail("");
      setCommentText("");
      setCommentRating(0);
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again later.");
    }
  };

  // Called when error dialog is closed; focuses the appropriate field.
  const handleValidationErrorDialogClose = () => {
    setValidationErrorDialogOpen(false);
    if (validationErrorField === "comment" && commentRef.current) {
      commentRef.current.focus();
    } else if (validationErrorField === "rating" && ratingRef.current) {
      // Focus the rating component if possible. If not, fallback to comment.
      ratingRef.current.focus?.() || commentRef.current.focus();
    }
  };

   // ===================== NEW COMMENT EDIT/DELETE FUNCTIONS =====================

  // Called when the edit icon is clicked on a comment.
  const handleEditClick = (comment) => {
    setSelectedComment(comment);
    setEditedText(comment.text);
    setEditedRating(comment.rating || 0);
    setEditDialogOpen(true);
  };

  // Updates the comment via the API.
  const handleSaveComment = async () => {
    if (!selectedComment || !recipeId) return;
    try {
      const jwt = auth.isAuthenticated();
      const response = await updateRecipeComment(
        recipeId,
        selectedComment._id,
        { text: editedText, rating: editedRating }
      );
      if (response.error) {
        setError(response.error);
      } else {
        // Update the comment in the local state
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          comments: prevRecipe.comments.map(comment =>
            comment._id === selectedComment._id
              ? { ...comment, text: editedText, rating: editedRating }
              : comment
          )
        }));
        setEditDialogOpen(false);
        setSelectedComment(null);
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Failed to update comment.");
    }
  };

  // Deletes a comment via the API.
  const handleDeleteComment = async (comment) => {
    if (!comment || !recipeId) return;
    try {
      const jwt = auth.isAuthenticated();
      const response = await deleteRecipeComment(recipeId, comment._id);
      if (response.error) {
        setError(response.error);
      } else {
        // Remove the deleted comment from the local state
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          comments: prevRecipe.comments.filter(c => c._id !== comment._id)
        }));
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment.");
    }
  };

  // ===================== END COMMENT EDIT/DELETE FUNCTIONS =====================

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </ThemeProvider>
    );
  }

  if (!recipe) return null;

  const imageUrl = getImageUrl(recipe);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: '100%', bgcolor: '#F9F9F9', minHeight: '100vh', py: 4 }}>
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            color: '#ff4400',
            fontSize: '2.5rem',
            mb: 4
          }}
        >
          Recipes
        </Typography>

        <Box
          sx={{
            maxWidth: 800,
            mx: 'auto',
            bgcolor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            position: 'relative',
            p: 3
          }}
        >
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              mb: 3,
              aspectRatio: '16 / 9',
              maxHeight: '400px',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={imageUrl}
              alt={recipe.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#f0f0f0',
              }}
              onError={(e) => {
                console.error('Error loading image:', e);
                e.target.onerror = null;
                e.target.src = '/placeholder.svg?height=400&width=800';
              }}
            />
          </Box>

          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" sx={{ mb: 2, pr: 4 }}>
            {recipe.title}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Posted by:{" "}
              <Link
                component={RouterLink}
                to={`/recipelist?creator=${encodeURIComponent(recipe.creator)}`}
                underline="hover"
              >
                {recipe.creator}
              </Link>
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Typography color="text.secondary">
                Prep: {recipe.preptime || '-'} mins
              </Typography>
              <Typography color="text.secondary" >
                Cook: {recipe.cooktime || '-'} mins
              </Typography>
              <Typography color="text.secondary" >
                Serves: {recipe.servings || '-'}
              </Typography>
            </Box>

            <Chip
              label="Medium"
              sx={{
                bgcolor: '#ffd700',
                color: '#000',
                fontWeight: 500
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2}}>Ingredients</Typography>
            {recipe.ingredients ? (
              <Box sx={{ pl: 2 }}>
                <RenderTextWithLineBreaks text={recipe.ingredients} />
              </Box>
            ) : (
              <Typography>No ingredients available</Typography>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2}}>Instructions</Typography>
            {recipe.instructions ? (
              <Box sx={{ pl: 2 }}>
                <RenderTextWithLineBreaks text={recipe.instructions} />
              </Box>
            ) : (
              <Typography>No instructions available</Typography>
            )}
          </Box>

          {(isCreator || isAdmin) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{
                  bgcolor: '#000000',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    color: '#000000',
                    border: '1px solid #000000'
                  }
                }}
              >
                Edit Recipe
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                  color: '#000000',
                  borderColor: '#ddd',
                  '&:hover': {
                    bgcolor: '#000000',
                    color: '#FFFFFF'
                  }
                }}
              >
                Delete Recipe
              </Button>
            </Box>
          )}
        </Box>

        {/* Comments Section */}
        <Box
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mt: 3,
            p: 2,
            bgcolor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Comments
          </Typography>

          {/* Display existing comments (if any) */}
          {recipe.comments && recipe.comments.length > 0 ? (
            recipe.comments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  position: 'relative', // Allows placing icons absolutely
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {comment.name} &mdash; {comment.email}
                </Typography>
                 {/* UPDATED: Show edit and delete icons if this comment belongs to the current user */}
                 {currentUser.email === comment.email && (
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton onClick={() => handleEditClick(comment)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteComment(comment)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                {/* Display star rating if it exists */}
                <Rating
                  name="read-only"
                  value={comment.rating || 0}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
                  {comment.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No comments yet.</Typography>
          )}

          {/* Only show "Leave a Comment" form if NOT the recipe owner */}
          {!isCreator && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Leave a Comment
              </Typography>

              <TextField
                fullWidth
                label="Name"
                value={currentUser.name || ""}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={currentUser.email || ""}
                disabled
                sx={{ mb: 2 }}
              />
              {/* Star Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ mr: 1 }}>Rating:</Typography>
                <Rating
                  ref={ratingRef}
                  name="recipe-rating"
                  value={commentRating}
                  onChange={(event, newValue) => {
                    setCommentRating(newValue);
                  }}
                  max={5}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comment"
                inputRef={commentRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleSubmitComment}>
                Submit
              </Button>
            </Box>
          )}
        </Box>

          {/* Validation Error Dialog */}
        <Dialog open={validationErrorDialogOpen} onClose={handleValidationErrorDialogClose}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {validationErrorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleValidationErrorDialogClose} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

         {/* Delete Confirmation Dialog */}  
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
        >
          <DialogTitle>Delete Recipe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this recipe? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        {/* ----------------------- COMMENTS SECTION -----------------------
        <Box
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mt: 3,
            p: 2,
            bgcolor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Comments
          </Typography> */}

          {/* Display existing comments (if any) */}
          {/* {recipe.comments && recipe.comments.length > 0 ? (
            recipe.comments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {comment.authorName}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {comment.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No comments yet.</Typography>
          )} */}

          {/* Only show "Leave a Comment" form if NOT the recipe owner */}
          {/* {!isCreator && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Leave a Comment
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                sx={{ mb: 1 }}
              />
              <Button variant="contained" onClick={handleSubmitComment}>
                Submit
              </Button>
            </Box>
          )}
        </Box> */}

        {/* ===================== EDIT COMMENT DIALOG ===================== */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Comment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Comment"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography sx={{ mr: 1 }}>Rating:</Typography>
              <Rating
                name="edit-comment-rating"
                value={editedRating}
                onChange={(e, newValue) => setEditedRating(newValue)}
                max={5}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveComment} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
        {/* ===================== END EDIT COMMENT DIALOG ===================== */}
  </Box>
</ThemeProvider>
);
}


