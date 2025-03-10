import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  updateUserSecurity,
  updateUserPassword,
  setUserAsAdmin,
  removeUserAsAdmin,
  getRecipesByUser,
  deleteRecipeComment
} from "./api-admin";
import auth from "../lib/auth-helper";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  
  
  

  // Dialog states for security and password updates
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newSecurityQuestion, setNewSecurityQuestion] = useState("");
  const [newSecurityAnswer, setNewSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Validation error messages
  const [securityError, setSecurityError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Recipe Dialog states
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [recipeUser, setRecipeUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);

  // Comment Dialog states
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedRecipeForComments, setSelectedRecipeForComments] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      if (data.error) {
        setMessage(data.error);
      } else {
        setUsers(data);
      }
    } catch (err) {
      setMessage("Failed to load users.");
    }
  };

  // --- Security Dialog Handlers ---
  const openSecurityDialog = (user) => {
    setSelectedUser(user);
    // Prepopulate with the user's current security question if available
    setNewSecurityQuestion(user.securityQuestion || "");
    setNewSecurityAnswer("");
    setSecurityError("");
    setSecurityDialogOpen(true);
  };

  const closeSecurityDialog = () => {
    setSecurityDialogOpen(false);
    setSelectedUser(null);
    setSecurityError("");
  };

  const handleUpdateSecurity = async () => {
    // Validate that both fields are provided
    if (!newSecurityQuestion.trim() || !newSecurityAnswer.trim()) {
      setSecurityError("Both security question and answer are required.");
      return;
    }
    // Call the API helper with keys matching the user account update
    const response = await updateUserSecurity(selectedUser._id, {
      securityQuestion: newSecurityQuestion,
      securityAnswerPlain: newSecurityAnswer,
    });
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Security question and answer updated successfully.");
      closeSecurityDialog();
      loadUsers();
    }
  };

  // --- Password Dialog Handlers ---
  const openPasswordDialog = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordDialogOpen(true);
  };

  const closePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setSelectedUser(null);
    setPasswordError("");
  };

  const handleUpdatePassword = async () => {
    // Validate password: non-empty and at least 6 characters
    if (!newPassword) {
      setPasswordError("Password cannot be empty.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
    // Call the API helper using key "password" as expected by your backend
    const response = await updateUserPassword(selectedUser._id, { password: newPassword });
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Password updated successfully.");
      closePasswordDialog();
      loadUsers();
    }
  };

  // --- Set/Remove Admin Handlers ---
  const handleSetAdmin = async (user) => {
    const response = await setUserAsAdmin(user._id);
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage(`${user.name} is now an admin.`);
      loadUsers();
    }
  };

  const handleRemoveAdmin = async (user) => {
    const response = await removeUserAsAdmin(user._id);
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage(`${user.name} is no longer an admin.`);
      loadUsers();
    }
  };

  // --- Recipe List Handler ---
  const handleShowRecipes = async (user) => {
    setRecipeUser(user);
    try {
      const recipesData = await getRecipesByUser(user.name);
      console.log("Fetched recipes:", recipesData); 
      if (recipesData.error) {
        setMessage(recipesData.error);
      } else {
        setUserRecipes(recipesData);
        setRecipeDialogOpen(true);
      }
    } catch (error) {
      setMessage("Failed to load recipes.");
    }
  };

  // --- Comment Dialog Handlers ---
  const openCommentDialog = (recipe) => {
    setSelectedRecipeForComments(recipe);
    setCommentDialogOpen(true);
  };

  const closeCommentDialog = () => {
    setCommentDialogOpen(false);
    setSelectedRecipeForComments(null);
  };

  const handleDeleteComment = async (recipeId, commentId) => {
    const response = await deleteRecipeComment(recipeId, commentId);
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Comment deleted successfully.");
      // Update the comments in the selected recipe locally
      setSelectedRecipeForComments((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
      // Also update the recipes list so that the comment count is updated there
        setUserRecipes((prevRecipes) =>
          prevRecipes.map((r) =>
            r._id === recipeId ? { ...r, comments: r.comments.filter((c) => c._id !== commentId) } : r
        )
      );
    }
  };

  // Get the authenticated user's name from auth
  const authUser = auth.isAuthenticated() && auth.isAuthenticated().user;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard {authUser ? `- ${authUser.name}` : ""}
      </Typography>
      {message && <Typography variant="body1" color="error">{message}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.admin ? "Yes" : "No"}</TableCell>
                <TableCell>
                {user.name === "Admin" ? (
                    // Super admin: only allow read-only action, e.g. view recipes
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => handleShowRecipes(user)}
                        sx={{ mr: 1 }}
                      >
                        Recipe List
                      </Button>
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        Super Admin
                      </Typography>
                    </>
                  ) : (
                    <>
                  <Button variant="outlined" onClick={() => openSecurityDialog(user)} sx={{ mr: 1 }}>
                    Reset Security Q/A
                  </Button>
                  <Button variant="outlined" onClick={() => openPasswordDialog(user)} sx={{ mr: 1 }}>
                    Reset Password
                  </Button>
                  <Button variant="outlined" onClick={() => handleShowRecipes(user)} sx={{ mr: 1 }}>
                    Recipe List
                  </Button>
                  {user.admin ? (
                    // If the user is admin, check if it is the current logged in admin.
                    user._id === authUser._id ? (
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        Current Logged In Admin
                      </Typography>
                    ) : (
                      <Button variant="outlined" onClick={() => handleRemoveAdmin(user)}>
                        Remove as Admin
                      </Button>
                    )
                  ) : (
                    <Button variant="outlined" onClick={() => handleSetAdmin(user)}>
                      Set as Admin
                    </Button>
                  )}
                  </>
                )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reset Security Q/A Dialog */}
      <Dialog open={securityDialogOpen} onClose={closeSecurityDialog}>
        <DialogTitle>Reset Security Question &amp; Answer</DialogTitle>
        <DialogContent>
          <TextField
            label="Security Question"
            fullWidth
            margin="dense"
            value={newSecurityQuestion}
            onChange={(e) => setNewSecurityQuestion(e.target.value)}
          />
          <TextField
            label="Security Answer"
            fullWidth
            margin="dense"
            value={newSecurityAnswer}
            onChange={(e) => setNewSecurityAnswer(e.target.value)}
          />
          {securityError && (
            <Typography variant="caption" color="error">
              {securityError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSecurityDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSecurity} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={closePasswordDialog}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="dense"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && (
            <Typography variant="caption" color="error">
              {passwordError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePasswordDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdatePassword} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recipe List Dialog */}
      <Dialog open={recipeDialogOpen} onClose={() => setRecipeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{recipeUser ? `${recipeUser.name}'s Recipes` : "Recipes"}</DialogTitle>
        <DialogContent>
          {userRecipes.length === 0 ? (
            <Typography>No recipes found.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Comment Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userRecipes.map((recipe) => (
                  <TableRow key={recipe._id}>
                    <TableCell>
                      <Button variant="text" onClick={() => openCommentDialog(recipe)}>
                        {recipe.title}
                      </Button>
                    </TableCell>
                    <TableCell>{recipe.comments ? recipe.comments.length : 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecipeDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
       {/* Comment Dialog */}
       <Dialog open={commentDialogOpen} onClose={closeCommentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Comments for {selectedRecipeForComments && selectedRecipeForComments.title}
        </DialogTitle>
        <DialogContent>
          {selectedRecipeForComments && selectedRecipeForComments.comments && selectedRecipeForComments.comments.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Comment</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRecipeForComments.comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell>{comment.text}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleDeleteComment(selectedRecipeForComments._id, comment._id)
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No comments found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCommentDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
