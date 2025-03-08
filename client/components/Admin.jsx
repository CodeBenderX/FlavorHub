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
                  <Button variant="outlined" onClick={() => openSecurityDialog(user)} sx={{ mr: 1 }}>
                    Reset Security Q/A
                  </Button>
                  <Button variant="outlined" onClick={() => openPasswordDialog(user)} sx={{ mr: 1 }}>
                    Reset Password
                  </Button>
                  {user.admin ? (
                    <Button variant="outlined" onClick={() => handleRemoveAdmin(user)}>
                      Remove as Admin
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={() => handleSetAdmin(user)}>
                      Set as Admin
                    </Button>
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
    </Box>
  );
}
