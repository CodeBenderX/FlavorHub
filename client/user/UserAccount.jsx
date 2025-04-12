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
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [updateData, setUpdateData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  }); 
  const [updateType, setUpdateType] = useState(""); 
  const [isUpdating, setIsUpdating] = useState(false); 
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

  
  useEffect(() => {
    if (updateType === "security" && user) {
      setUpdateData((prev) => ({
        ...prev,
        securityQuestion: user.securityQuestion || "",
        securityAnswer: "",
      }));
    }
  }, [updateType, user]);

  
  const handleChange = (e) => {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

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
    if (updateType === "security") {
      
      if (!updateData.securityQuestion || !updateData.securityAnswer) {
        alert("Security question and answer are required.");
        return;
      }
    }
    setIsUpdating(true); 
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
      } else if (updateType === "security") {
        updatedUser = await update(
          { userId: jwt.user._id },
          { t: jwt.token },
          { 
            securityQuestion: updateData.securityQuestion,
            securityAnswerPlain: updateData.securityAnswer
          }
        );
      } else {
        updatedUser = await update(
          { userId: jwt.user._id },
          { t: jwt.token },
          { [updateType]: updateData[updateType] }
        );
      }
      setUser(updatedUser);
      setUpdateData({ name: "", email: "", password: "", confirmPassword: "", securityQuestion: "", securityAnswer: "" });
      setUpdateType(""); 

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
        backgroundColor: "#F9F9F9"
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Welcome, {user?.name || "User"}
          </Typography>
        </CardContent>
      </Card>

      
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
              <MenuItem value="security">Security</MenuItem>
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
          {updateType === "security" && (
            <>
              <TextField
                fullWidth
                label="Security Question"
                name="securityQuestion"
                value={updateData.securityQuestion}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Security Answer"
                name="securityAnswer"
                value={updateData.securityAnswer}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          
          <Button
            
            onClick={handleUpdate}
            fullWidth
            disabled={isUpdating || !updateType}
            sx={{ marginTop: 2, color:"#000000", border: "1px solid #000000", backgroundColor: "#FFFFFF", "&:hover":{backgroundColor:"#000000", color:"#FFFFFF"}}}
          >
            
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </CardContent>
      </Card>

     
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
