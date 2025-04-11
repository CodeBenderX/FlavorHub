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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
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
    width: "90%",
    maxWidth: 500,
    margin: "auto",
    textAlign: "center",
    alignItems: "center",
    marginTop: { xs: "auto", sm: 10 },
    paddingBottom: 2,
    borderRadius: "10px",
    boxShadow: { xs: "none", sm: "0px 2px 10px rgba(0,0,0,0.1)" },
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: 2,
    color: "#DA3743",
    fontSize: { xs: "1.5rem", sm: "1.75rem" },
  },
  textField: {
    marginLeft: 1,
    marginRight: 1,
    width: "90%",
    maxWidth: 300,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "center",
    gap: 2,
    marginTop: 2,
  },
  loginButton: {
    marginBottom: { xs: 2, sm: 0 },
    bgcolor: "#000000",
    color: "white",
    "&:hover": {
      bgcolor: "#FFFFFF",
      color: "#000000",
      border: "1px solid #000000",
    },
  },
  registerButton: {
    border: "1px solid #000000",
    "&:hover": {
      bgcolor: "#000000",
      color: "#FFFFFF !important",
    },
  },
  imageContainer: {
    display: { xs: "none", md: "flex" },
    height: "100vh",
  },
  rootContainer: {
    backgroundColor: "#F9F9F9",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
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

  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const [resetSuccessDialogOpen, setResetSuccessDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  const handleOpenForgotPassword = () => {
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

  
  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
  };

  
  const handleForgotPasswordSubmit = async () => {
    
    const response = await forgotPassword({ email: fpEmail });
    if (response.error) {
      setFpError(response.error);
    } else if (response.securityQuestion) {
      setFpMessage(response.message || "Security question retrieved.");
      setSecurityQuestion(response.securityQuestion);
      
      setForgotPasswordOpen(false);

      setSecurityQuestionDialogOpen(true);
    } else {
      setFpError("Unexpected response from server.");
    }
  };

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

    const normalizedAnswer = securityAnswer.trim().toLowerCase();
    const response = await verifySecurityAnswer({
      email: fpEmail,
      securityAnswer: normalizedAnswer,
    });
    if (response.error) {
      setSqError(response.error);
    } else {
      setSqMessage("Security answer verified. You can now reset your password.");
      setSecurityQuestionDialogOpen(false);
      setResetPasswordDialogOpen(true);
    }
  };

  const handleCloseResetPassword = () => {
    setResetPasswordDialogOpen(false);
  };

  const handleResetPasswordSubmit = async () => {
    setResetError("");
    setResetMessage("");

    if (!newPassword || !confirmPassword) {
      setResetError("Please fill out both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    const response = await resetPassword({ email: fpEmail, newPassword });
    if (response.error) {
      setResetError(response.error);
    } else {
      setResetMessage("Your password has been successfully reset.");
      
      setResetPasswordDialogOpen(false);
      setResetSuccessDialogOpen(true);
    }
  };

  
  const handleCloseResetSuccessDialog = () => {
    setResetSuccessDialogOpen(false);
    navigate("/signin"); 
  };

  return (
    <Box sx={useStyles.rootContainer}>
      <Grid container spacing={0} sx={{ width: "100%", height: "100%" }}>
        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
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
              <Box sx={useStyles.buttonContainer}>
                <Button
                  variant="contained"
                  onClick={clickSubmit}
                  sx={useStyles.loginButton}
                  fullWidth={isMobile}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={clickRegister}
                  sx={useStyles.registerButton}
                  fullWidth={isMobile}
                >
                  Register
                </Button>
              </Box>
              <Typography component="p" color="#000000" sx={{ mt: 2 }}>
                Don't have an account? <Link to="/signup">Join Now</Link>
              </Typography>
              <Typography
                component="p"
                sx={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  mt: 1,
                  color: "#000000",
                }}
                onClick={handleOpenForgotPassword}
              >
                Forgot Password?
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={useStyles.imageContainer}>
          <Box
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="Healthy food"
            src={loginpage}
          />
        </Grid>
      </Grid>

      
      <Dialog open={forgotPasswordOpen} onClose={handleCloseForgotPassword} fullWidth maxWidth="xs">
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

      
      <Dialog
        open={securityQuestionDialogOpen}
        onClose={handleCloseSecurityQuestion}
        fullWidth
        maxWidth="xs"
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

      
      <Dialog open={resetPasswordDialogOpen} onClose={handleCloseResetPassword} fullWidth maxWidth="xs">
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

      
      <Dialog
        open={resetSuccessDialogOpen}
        onClose={handleCloseResetSuccessDialog}
        fullWidth
        maxWidth="xs"
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
    </Box>
  );
}