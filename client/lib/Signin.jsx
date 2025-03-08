import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip"; // <-- Secret icon
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  signin,
  forgotPassword,
  verifySecurityAnswer,
  resetPassword,
} from "./api-auth.js";
import auth from "./auth-helper";
import loginpage from "../src/assets/login-signup.jpeg";

const useStyles = {
  card: {
    maxWidth: 500,
    margin: "auto",
    textAlign: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 2,
    borderRadius: "10px",
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: 2,
    color: "red",
  },
  textField: {
    marginLeft: 1,
    marginRight: 1,
    width: 300,
  },
};

export default function Signin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpMessage, setFpMessage] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");

  const [securityQuestionDialogOpen, setSecurityQuestionDialogOpen] =
    useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [sqError, setSqError] = useState("");
  const [sqMessage, setSqMessage] = useState("");

  // ----- Reset Password Dialog State -----
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // New state for the success dialog:
  const [resetSuccessDialogOpen, setResetSuccessDialogOpen] = useState(false);

  // Admin login modal state
  const [adminLoginDialogOpen, setAdminLoginDialogOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const clickRegister = () => {
    navigate("/signup");
  };

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: "", redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { from } = location.state || {
    from: {
      pathname: "/member",
    },
  };

  const { redirectToReferrer } = values;
  if (redirectToReferrer) {
    return <Navigate to={from} />;
  }

  if (values.redirectToReferrer) {
    return <Navigate to={from} />;
  }

  // Open Forgot Password modal
  const handleOpenForgotPassword = () => {
    // Reset all states related to forgot password flow
    setForgotPasswordOpen(true);
    setFpEmail("");
    setFpError("");
    setFpMessage("");
    setSecurityQuestion("");
    setSecurityAnswer("");
    setSqError("");
    setSqMessage("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
    setResetMessage("");
  };

  // Close Forgot Password modal
  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
  };

  // Handle Forgot Password submit
  const handleForgotPasswordSubmit = async () => {
    // Call the backend API to retrieve the security question
    const response = await forgotPassword({ email: fpEmail });
    console.log("Forgot password response:", response);
    if (response.error) {
      setFpError(response.error);
    } else if (response.securityQuestion) {
      // If a security question is returned, proceed to the next step.
      //setFpMessage(response.message || "Security question retrieved.");
      // Close the email dialog and open the security question dialog.
      setFpMessage(response.message || "Security question retrieved.");
      setSecurityQuestion(response.securityQuestion);

      // Close the forgot password email dialog
      setForgotPasswordOpen(false);

      // Open the security question dialog
      setSecurityQuestionDialogOpen(true);
    } else {
      setFpError("Unexpected response from server.");
    }
  };

  // const handleOpenSecurityQuestionDialog = () => {
  //   setSecurityQuestionDialogOpen(true);
  //   setSecurityAnswer("");
  //   setSqError("");
  //   setSqMessage("");
  // }
  // ----- Security Question Dialog -----
  const handleCloseSecurityQuestion = () => {
    setSecurityQuestionDialogOpen(false);
  };

  const handleSecurityQuestionSubmit = async () => {
    if (!securityAnswer) {
      setSqError("Please provide an answer.");
      return;
    }
    setSqError("");
    setSqMessage("");

    // Call the backend to verify the security answer
    // Normalize the answer before sending it
    const normalizedAnswer = securityAnswer.trim().toLowerCase();

    const response = await verifySecurityAnswer({
      email: fpEmail,
      securityAnswer: normalizedAnswer,
    });
    if (response.error) {
      setSqError(response.error);
    } else {
      setSqMessage(
        "Security answer verified. You can now reset your password."
      );
      setSecurityQuestionDialogOpen(false);
      setResetPasswordDialogOpen(true);
    }
  };

  // ----- Reset Password Dialog Handlers -----
  const handleCloseResetPassword = () => {
    setResetPasswordDialogOpen(false);
  };

  // 3. Submit the new password to the backend
  const handleResetPasswordSubmit = async () => {
    setResetError("");
    setResetMessage("");

    // Validate new password fields
    if (!newPassword || !confirmPassword) {
      setResetError("Please fill out both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    // Call the backend to reset the password
    const response = await resetPassword({ email: fpEmail, newPassword });
    if (response.error) {
      setResetError(response.error);
    } else {
      setResetMessage("Your password has been successfully reset.");
      // Optionally, you can close the dialog after a delay:
      setResetPasswordDialogOpen(false);
      setResetSuccessDialogOpen(true);
    }
  };

  // ----- Reset Success Dialog -----
  const handleCloseResetSuccessDialog = () => {
    setResetSuccessDialogOpen(false);
    navigate("/signin"); // Navigate back to sign-in page. Adjust the route if needed.
  };

  // Handler for the secret icon double-click: open admin login modal
  const handleSecretIconDoubleClick = () => {
    // Reset admin login state
    setAdminEmail("");
    setAdminPassword("");
    setAdminError("");
    setAdminLoginDialogOpen(true);
  };

  // Handler for admin login form submission
  const handleAdminLoginSubmit = async () => {
    setAdminError("");
    // Call your signin API with admin credentials
    const data = await signin({ email: adminEmail, password: adminPassword });
    if (data.error) {
      setAdminError(data.error);
    } else {
      // Check if the signed-in user has an admin role
      if (data.user.role !== "admin") {
        setAdminError("Access denied. Not an admin account.");
        auth.clearJWT();
      } else {
        auth.authenticate(data, () => {
          setAdminLoginDialogOpen(false);
          navigate("/admin/dashboard"); // Adjust this route as needed
        });
      }
    }
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#FFF4F0",
      }}
    >
      <Grid container spacing={0} sx={{ maxWidth: "100%" }}>
        <Grid item xs={12} md={6}>
          <Card sx={useStyles.card}>
            <CardContent>
              <Typography variant="h6" sx={useStyles.title}>
                Login
              </Typography>
              <TextField
                id="email"
                type="email"
                label="Email"
                sx={useStyles.textField}
                value={values.email}
                onChange={handleChange("email")}
                margin="normal"
              />
              <br />
              <TextField
                id="password"
                type="password"
                label="Password"
                sx={useStyles.textField}
                value={values.password}
                onChange={handleChange("password")}
                margin="normal"
              />
              <br />
              {values.error && (
                <Typography component="p" color="error">
                  {values.error}
                </Typography>
              )}
              <br />
              <Button
                color="#FFFFFF"
                variant="contained"
                onClick={clickSubmit}
                sx={{
                  margin: "auto",
                  marginBottom: 2,
                  marginRight: 1,
                  bgcolor: "#000000",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#FFFFFF",
                    border: "1px solid #000000",
                  },
                }}
              >
                Login
              </Button>
              <Button
                color="#000000"
                variant="contained"
                onClick={clickRegister}
                sx={{
                  margin: "auto",
                  marginBottom: 2,
                  marginLeft: 1,
                  border: "1px solid #000000",
                  "&:hover": {
                    bgcolor: "#000000",
                    color: "#FFFFFF !important",
                  },
                }}
              >
                Register
              </Button>
              <Typography component="p" color="#000000">
                Don't have an account? <Link to="/signup">Join Now</Link>
              </Typography>
              <Typography
                component="p"
                sx={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  mt: 1,
                  color: "#000000", // ✅ Moved color inside sx
                }}
                onClick={handleOpenForgotPassword}
              >
                Forgot Password?
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            sx={{
              maxWidth: "100%",
              width: "100%",
              height: "100vh",
              objectFit: "cover",
            }}
            alt="Healthy food"
            src={loginpage}
          />
        </Grid>
      </Grid>
      {/* Secret Icon in the lower-left corner */}
      <Box
        sx={{
          position: "fixed",
          left: 20,
          bottom: 20,
          cursor: "pointer",
          zIndex: 9999,
        }}
        onDoubleClick={handleSecretIconDoubleClick}
      >
        <IconButton>
          <PrivacyTipIcon sx={{ color: "gray", fontSize: 30 }} />
        </IconButton>
      </Box>
      {/* Forgot Password Modal */}
      <Dialog open={forgotPasswordOpen} onClose={handleCloseForgotPassword}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Enter your email address:</Typography>
          <TextField
            fullWidth
            label="Email"
            value={fpEmail}
            onChange={(e) => setFpEmail(e.target.value)}
            margin="dense"
          />
          {fpError && <Typography color="error">{fpError}</Typography>}
          {fpMessage && <Typography color="primary">{fpMessage}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleForgotPasswordSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Security Question Dialog */}
      <Dialog
        open={securityQuestionDialogOpen}
        onClose={handleCloseSecurityQuestion}
      >
        <DialogTitle>Security Question</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{securityQuestion}</Typography>
          <TextField
            fullWidth
            label="Your Answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            margin="dense"
          />
          {sqError && <Typography color="error">{sqError}</Typography>}
          {sqMessage && <Typography color="primary">{sqMessage}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSecurityQuestion} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSecurityQuestionSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onClose={handleCloseResetPassword}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
            fullWidth
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="dense"
            fullWidth
          />
          {resetError && <Typography color="error">{resetError}</Typography>}
          {resetMessage && (
            <Typography color="primary">{resetMessage}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetPassword} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleResetPasswordSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reset Success Dialog */}
      <Dialog
        open={resetSuccessDialogOpen}
        onClose={handleCloseResetSuccessDialog}
      >
        <DialogTitle>Password Reset Successful</DialogTitle>
        <DialogContent>
          <Typography>Your password has been successfully reset.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetSuccessDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* Admin Login Modal */}
      <Dialog
        open={adminLoginDialogOpen}
        onClose={() => setAdminLoginDialogOpen(false)}
      >
        <DialogTitle>Admin Login</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            margin="dense"
          />
          {adminError && (
            <Typography color="error" variant="body2">
              {adminError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminLoginDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAdminLoginSubmit} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
