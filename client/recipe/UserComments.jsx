
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating
} from "@mui/material";
import auth from "../lib/auth-helper";
import { updateRecipeComment, deleteRecipeComment } from "../recipe/api-recipe";

export default function UserComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(0);

  const currentUser = auth.isAuthenticated() ? auth.isAuthenticated().user : null;

  useEffect(() => {
    const fetchComments = async () => {
      if (!currentUser) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        const jwt = auth.isAuthenticated();
        const response = await fetch(
          `/api/comments/byuser/${encodeURIComponent(currentUser.email)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt.token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message || "Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [currentUser]);

  const handleRowClick = (comment, e) => {
    if(e) e.stopPropagation();
    setSelectedComment(comment);
    setEditedText(comment.text);
    setEditedRating(comment.rating || 0);
    setEditDialogOpen(true);
  };

  const handleSaveComment = async () => {
    if (!selectedComment || !selectedComment.recipeId) {
      setError("Invalid comment data");
      return;
    }
    const response = await updateRecipeComment(
      selectedComment.recipeId,
      selectedComment._id,
      { text: editedText, rating: editedRating }
    );
    if (response.error) {
      setError(response.error);
    } else {
      setComments((prevComments) =>
        prevComments.map((comm) =>
          comm._id === selectedComment._id ? { ...comm, text: editedText, rating: editedRating } : comm
        )
      );
      setEditDialogOpen(false);
      setSelectedComment(null);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment || !selectedComment.recipeId) {
      setError("Invalid comment data");
      return;
    }
    const response = await deleteRecipeComment(selectedComment.recipeId, selectedComment._id);
    if (response.error) {
      setError(response.error);
    } else {
      setComments((prevComments) =>
        prevComments.filter((comm) => comm._id !== selectedComment._id)
      );
      setEditDialogOpen(false);
      setSelectedComment(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Comments
      </Typography>
      {comments.length === 0 ? (
        <Typography>No comments made yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipe Title</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment._id} hover sx={{ cursor: "pointer" }} onClick={(e) => handleRowClick(comment, e)}>
                  <TableCell>
                    <Button
                      variant="text"
                      sx={{ textTransform: "none", p: 0 }}
                      onClick={(e) => handleRowClick(comment, e)}
                    >
                      {comment.recipeTitle}
                    </Button>
                  </TableCell>
                  <TableCell>{comment.text}</TableCell>
                  <TableCell>{comment.rating}</TableCell>
                  <TableCell>{new Date(comment.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

     
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          {selectedComment && (
            <>
              <Typography variant="subtitle1">
                Recipe: {selectedComment.recipeTitle}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comment"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography sx={{ mr: 1 }}>Rating:</Typography>
                <Rating
                  value={editedRating}
                  onChange={(event, newValue) => setEditedRating(newValue)}
                  max={5}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteComment} color="error">
            Delete
          </Button>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveComment} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
