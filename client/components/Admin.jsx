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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  updateUserSecurity,
  updateUserPassword,
  setUserAsAdmin,
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
    setNewSecurityQuestion("");
    setNewSecurityAnswer("");
    setSecurityDialogOpen(true);
  };

  const closeSecurityDialog = () => {
    setSecurityDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateSecurity = async () => {
    if (!selectedUser) return;
    const response = await updateUserSecurity(selectedUser._id, {
      newSecurityQuestion,
      newSecurityAnswer,
    });
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Security question and answer updated.");
      closeSecurityDialog();
      loadUsers();
    }
  };

  // --- Password Dialog Handlers ---
  const openPasswordDialog = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setPasswordDialogOpen(true);
  };

  const closePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUpdatePassword = async () => {
    if (!selectedUser) return;
    const response = await updateUserPassword(selectedUser._id, { newPassword });
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Password updated.");
      closePasswordDialog();
      loadUsers();
    }
  };

  // --- Set as Admin Handler ---
  const handleSetAdmin = async (user) => {
    const response = await setUserAsAdmin(user._id);
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage(`${user.name} is now an admin.`);
      loadUsers();
    }
  };

  // Get the authenticated user's name from auth
  const authUser = auth.isAuthenticated() && auth.isAuthenticated().user;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard {authUser ? `- ${authUser.name}` : ""}
      </Typography>
      {message && (
        <Typography variant="body1" color="error">
          {message}
        </Typography>
      )}
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
                  <Button
                    variant="outlined"
                    onClick={() => openSecurityDialog(user)}
                    style={{ marginRight: 8 }}
                  >
                    Reset Security Q/A
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => openPasswordDialog(user)}
                    style={{ marginRight: 8 }}
                  >
                    Reset Password
                  </Button>
                  {!user.admin && (
                    <Button
                      variant="outlined"
                      onClick={() => handleSetAdmin(user)}
                    >
                      Set as Admin
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reset Security Question/Answer Dialog */}
      <Dialog open={securityDialogOpen} onClose={closeSecurityDialog}>
        <DialogTitle>Reset Security Question &amp; Answer</DialogTitle>
        <DialogContent>
          <TextField
            label="New Security Question"
            fullWidth
            margin="dense"
            value={newSecurityQuestion}
            onChange={(e) => setNewSecurityQuestion(e.target.value)}
          />
          <TextField
            label="New Security Answer"
            fullWidth
            margin="dense"
            value={newSecurityAnswer}
            onChange={(e) => setNewSecurityAnswer(e.target.value)}
          />
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
    </div>
  );
}
