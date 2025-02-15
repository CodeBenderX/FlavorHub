import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Grid2,
} from "@mui/material";
import { CloudUpload, Cancel } from "@mui/icons-material";
import { create } from "./api-recipe";
import auth from "../lib/auth-helper.js";
import imageCompression from "browser-image-compression";

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    preptime: "",
    cooktime: "",
    servings: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const authStatus = auth.isAuthenticated();
    console.log("Authentication status:", authStatus);
    if (!authStatus) {
      setError("You must be logged in to create a recipe.");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  };

  const handleChange = (name) => async (event) => {
    if (name === "image") {
      const file = event.target.files[0];
      if (file) {
        try {
          const compressedFile = await compressImage(file);
          setValues({ ...values, [name]: compressedFile });
          setImagePreview(URL.createObjectURL(compressedFile));
        } catch (err) {
          console.error("Error compressing image:", err);
          setError("Error processing image. Please try a different file.");
        }
      }
    } else {
      const value = event.target.value;
      setValues({ ...values, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCancelImage = () => {
    setValues({ ...values, image: "" });
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!values.title.trim()) newErrors.title = "Title is required";
    if (!values.instructions.trim())
      newErrors.instructions = "Instructions are required";
    if (!values.ingredients.trim())
      newErrors.ingredients = "Ingredients are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", values); // Debug log

    if (!isAuthenticated) {
      setError("You must be logged in to create a recipe.");
      return;
    }

    if (!validateForm()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const jwt = auth.isAuthenticated();
      if (!jwt) {
        throw new Error("You must be logged in to create a recipe.");
      }

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "image" && values[key]) {
          formData.append("image", values[key], values[key].name);
        } else {
          formData.append(key, values[key]);
        }
      });

      const result = await create({ t: jwt.token }, formData);
      if (result.error) {
        throw new Error(result.error);
      }

      navigate("/recipelist?added=true");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" align="center" sx={{ mb: 2 }}>
          Authentication Required
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: "#FFF4EA" }}>
      <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          align="center"
          color="#FF6E1C"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Recipes
        </Typography>

        <Card sx={{ p: 4, bgcolor: "#fff" }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Add new Recipe
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Recipe Title*"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={values.title}
                onChange={handleChange("title")}
                required
                error={!!errors.title}
                helperText={errors.title}
              />

              <TextField
                label="Ingredients*"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                value={values.ingredients}
                onChange={handleChange("ingredients")}
                required
                error={!!errors.ingredients}
                helperText={errors.ingredients}
              />

              <TextField
                label="Instructions*"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
                value={values.instructions}
                onChange={handleChange("instructions")}
                required
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Prep Time
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      type="number"
                      size="small"
                      value={values.preptime}
                      onChange={handleChange("preptime")}
                      sx={{ width: "150px" }}
                      inputProps={{ min: 0 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            Minutes
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Cook Time
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      type="number"
                      size="small"
                      value={values.cooktime}
                      onChange={handleChange("cooktime")}
                      sx={{ width: "150px" }}
                      inputProps={{ min: 0 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            Minutes
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Servings
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={values.servings}
                    onChange={handleChange("servings")}
                    sx={{ width: "90px" }}
                    inputProps={{ min: 0 }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                {imagePreview && (
                  <Box
                    sx={{
                      mb: 2,
                      width: "100%",
                      height: "200px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{
                      width: imagePreview ? "30%" : "100%",
                    }}
                  >
                    {imagePreview ? "Change" : "Upload an image"}
                    <input
                      type="file"
                      hidden
                      onChange={handleChange("image")}
                      accept="image/*"
                    />
                  </Button>
                  {imagePreview && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelImage}
                      startIcon={<Cancel />}
                      sx={{ width: "30%" }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
              {values.image && (
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                  Selected file: {values.image.name}
                </Typography>
              )}
              <Grid2 container spacing={2} justifyContent="center">
                <Grid2 item xs={12} sm={6} md={5}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mb: 3,
                      backgroundColor: "#333",
                      "&:hover": {
                        backgroundColor: "#444",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Add Recipe"}
                  </Button>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={5}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate("/recipelist")}
                  >
                    Cancel
                  </Button>
                </Grid2>
              </Grid2>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert onClose={() => setSuccess(false)} severity="success">
            Recipe added successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default AddRecipePage;
