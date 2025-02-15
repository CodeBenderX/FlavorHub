import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

const ContactUsPage = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = "Name is required";
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!values.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials:'include',
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit the form');
        }

        const data = await response.json();
        setSnackbar({
          open: true,
          message: data.message || "Message sent successfully!",
          severity: "success",
        });
        setValues({ name: "", email: "", message: "" });
      } catch (error) {
        console.error('Error submitting form:', error);
        setSnackbar({
          open: true,
          message: error.message || "Failed to send message. Please try again.",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ backgroundColor: "#FFF5EB", minHeight: "100vh", padding: 4 }}> 
      <Container component="main" maxWidth="sm" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: "bold", color: "#FF7043", marginBottom: 2 }}
        >
          Contact Us
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ color: "#555", marginBottom: 4 }}
        >
          We'd love to hear from you! Whether you have a question, feedback, or just want to share your latest culinary creation, we're here to help. Reach out to us using the form below, and we'll get back to you as soon as possible.
        </Typography>

        <Card sx={{ padding: 4, backgroundColor: "#fff" }}>
          <CardContent>
            <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", marginBottom: 3 }}>
              Get in Touch
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                name="name"
                value={values.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />

              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />

              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ marginBottom: 3 }}
                name="message"
                value={values.message}
                onChange={handleChange}
                error={!!errors.message}
                helperText={errors.message}
                required
              />

              <Box sx={{ textAlign: "center" }}>
                <Button 
                  type="submit"
                  variant="contained" 
                  disabled={isSubmitting}
                  sx={{ 
                    backgroundColor: "#333",
                    padding: "10px 24px",
                    "&:hover": {
                      backgroundColor: "#555"
                    }
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Send Message"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ContactUsPage;