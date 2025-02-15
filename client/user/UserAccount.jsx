import React, { useEffect, useState } from "react";
import auth from "../lib/auth-helper.js";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { read, update, remove } from "./api-user.js";
import {updateRecipeCreators, deleteUserRecipes, transferRecipesToAdmin} from "../recipe/api-recipe.js";

const UserAccount = () => {
  const [user, setUser] = useState(null); // Initialize user as null
  const [loading, setLoading] = useState(true); // Loading state for conditional rendering
  const [error, setError] = useState(null); // Error state for any fetch issues
  const [updateData, setUpdateData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }); // State for update form
  const [updateType, setUpdateType] = useState(""); // Update form selector
  const [isUpdating, setIsUpdating] = useState(false); // State to manage update button state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [deleteOption, setDeleteOption] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const jwt = auth.isAuthenticated();
      if (jwt) {
        try {
          const data = await read({ userId: jwt.user._id }, { t: jwt.token });
          setUser(data);
          setIsAdmin(jwt.user.name === "Admin");
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Could not load user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Handle update form changes
  const handleChange = (e) => {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle updating the user information
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate the update data
    if (updateType === "name" && !updateData.name) {
      alert("Name is required.");
      return;
    }
    if (updateType === "email" && !updateData.email) {
      alert("Email is required.");
      return;
    }
    if (updateType === "password") {
      if (!updateData.password || !updateData.confirmPassword) {
        alert("Both password fields are required.");
        return;
      }
      if (updateData.password !== updateData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }

    setIsUpdating(true); // Disable the button during update
    setError(null);
    const jwt = auth.isAuthenticated();
    try {
      let updatedUser;
      if (updateType === "name") {
        const oldName = user?.name;
        const newName = updateData.name;
        updatedUser = await update(
          { userId: jwt.user._id },
          { t: jwt.token },
          { name: newName }
        );
        console.log("User name updated successfully");

        try {
          const updateResult = await updateRecipeCreators(
            { oldName, newName },
            { t: jwt.token }
          );
        } catch (recipeUpdateError) {
          console.error('Error updating recipe creators:', recipeUpdateError);
          throw new Error(`User name updated, but failed to update recipe creators: ${recipeUpdateError.message}`);
        }
      } else if (updateType === "password") {
        updatedUser = await update(
          { userId: jwt.user._id },
          { t: jwt.token },
          { password: updateData.password }
        );
      } else {
        updatedUser = await update(
          { userId: jwt.user._id },
          { t: jwt.token },
          { [updateType]: updateData[updateType] }
        );
      }
      setUser(updatedUser);
      setUpdateData({ name: "", email: "", password: "", confirmPassword: "" });
      setUpdateType(""); // Reset the selection

      alert(`${updateType.charAt(0).toUpperCase() + updateType.slice(1)} updated successfully. Please log in again.`);
      auth.clearJWT();
      window.location.href = "/signin";
    } catch (err) {
      console.error("Error updating user data:", err);
      setError("Could not update user data. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteOption = (option) => {
    setDeleteOption(option);
    setDeleteDialogOpen(false);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const jwt = auth.isAuthenticated();
    try {
      if (deleteOption === "deleteAll") {
        await deleteUserRecipes({ name: jwt.user.name }, { t: jwt.token });
      } else if (deleteOption === "transfer") {
        const oldName = user?.name;
        const newName = 'Admin';
        try {
          const updateResult = await updateRecipeCreators(
            { oldName, newName },
            { t: jwt.token }
          );
          
        } catch (recipeUpdateError) {
          console.error('Error updating recipe creators:', recipeUpdateError);
          throw new Error(`User name updated, but failed to update recipe creators: ${recipeUpdateError.message}`);
        }
      }
      await remove({ userId: jwt.user._id }, { t: jwt.token });
      auth.clearJWT();
      window.location.href = "/signin";
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Could not delete account. Please try again later.");
    } finally {
      setDeleteConfirmDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 3,
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: "#FFF4EA"
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Welcome, {user?.name || "User"}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            Your ID: {user?._id || 'No ID available'}
          </Typography> */}
        </CardContent>
      </Card>

      {/* Update Form */}
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent>
          <Typography variant="h6">Update Your Information</Typography>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={user?.name || ""}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={user?.email || ""}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <Select
              labelId="update-type-label"
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">Select Information to Update</MenuItem>
              {!isAdmin && <MenuItem value="name">Name</MenuItem>}
              {!isAdmin && <MenuItem value="email">Email</MenuItem>}
              <MenuItem value="password">Password</MenuItem>
            </Select>
          </FormControl>
          {updateType === "name" && (
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={updateData.name}
              onChange={handleChange}
              margin="normal"
            />
          )}
          {updateType === "email" && (
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={updateData.email}
              onChange={handleChange}
              margin="normal"
            />
          )}
          {updateType === "password" && (
            <>
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={updateData.password}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={updateData.confirmPassword}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          {/* Update Button */}
          <Button
            // variant="contained"
            onClick={handleUpdate}
            fullWidth
            disabled={isUpdating || !updateType}
            sx={{ marginTop: 2, color:"#000000", border: "1px solid #000000", backgroundColor: "#FFFFFF", "&:hover":{backgroundColor:"#000000", color:"#FFFFFF"}}}
          >
            {/* Update */}
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account */}
      {!isAdmin && (
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleDeleteAccount}
            sx={{ marginTop: 1,
                      backgroundColor: "#000000",
                      "&:hover": {
                        backgroundColor: "#FFFFFF", border:"1px solid #000000"
                      },}}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
       )}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What would you like to do with your recipes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteOption("deleteAll")}>Delete All Recipes</Button>
          <Button onClick={() => handleDeleteOption("transfer")}>Transfer Recipes to Admin</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmDialogOpen} onClose={() => setDeleteConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteOption === "deleteAll"
              ? "This will permanently delete your account and all your recipes. Are you sure?"
              : "This will delete your account and transfer your recipes to the admin. Are you sure?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAccount;
