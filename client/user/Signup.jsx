import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Grid, 
  Box,
  useMediaQuery,
  useTheme 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { create } from './api-user';
import loginpage from '../src/assets/login-signup.jpeg';

const useStyles = {
  rootContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    bgcolor: '#f9f9f9',
    padding: { xs: 2, sm: 0 }
  },
  card: {
    maxWidth: 500,
    margin: 'auto',
    textAlign: 'center',
    alignItems: 'center',
    marginTop: { xs: 0, sm: 5 },
    paddingBottom: 2,
    borderRadius: '10px',
    boxShadow: { xs: 'none', sm: '0px 2px 10px rgba(0,0,0,0.1)' }
  },
  title: {
    marginTop: 2,
    color: '#DA3743',
    fontSize: { xs: '1.5rem', sm: '1.75rem' },
    fontWeight: 'bold'
  },
  textField: {
    width: '100%',
    maxWidth: 400,
    margin: '8px auto'
  },
  submit: {
    margin: 'auto',
    marginBottom: 2,
    color: '#F5F5F5',
    background: '#000000',
    width: { xs: '100%', sm: 'auto' },
    padding: { xs: '10px 0', sm: '6px 16px' }
  },
  imageContainer: {
    display: { xs: 'none', md: 'flex' },
    height: '100vh'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  linkText: {
    mt: 2,
    fontSize: { xs: '0.9rem', sm: '1rem' }
  }
};

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    error: '',
    open: false
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Handles changes to form inputs
   * @param {string} name - The name of the field being changed
   * @returns {function} - Event handler for the input change
   */
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  /**
   * Closes the success dialog and navigates to signin page
   */
  const handleClose = () => {
    setValues({ ...values, open: false });
    navigate('/signin');
  };

  /**
   * Validates and submits the signup form
   */
  const clickSubmit = () => {
    if (!values.name || !values.email || !values.password || !values.confirmPassword || !values.securityQuestion || !values.securityAnswer) {
      setValues({ ...values, error: "All fields are required" });
      return;
    }

    if (/\d/.test(values.name)) {
      setValues({ ...values, error: "Name should not contain numbers" });
      return;
    }

    if (
      !/^(?!.*\.\.)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(values.email)
    ) {
      setValues({ ...values, error: "Invalid email format" });
      return;
    }

    if (values.password.length < 8) {
      setValues({ ...values, error: "Password must be at least 8 characters long" });
      return;
    }

    if (values.password !== values.confirmPassword) {
      setValues({ ...values, error: "Passwords don't match" });
      return;
    }

    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      securityQuestion: values.securityQuestion || undefined,
      securityAnswerPlain: values.securityAnswer || undefined
    };

    create(user).then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, error: '' });
          setOpen(true);
        }
      })
  };

  return (
    <Box sx={useStyles.rootContainer}>
      <Grid container spacing={0} sx={{ width: '100%', margin: 0 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Card sx={useStyles.card}>
            <CardContent>
              <Typography variant="h6" sx={useStyles.title}>
                Create Account
              </Typography>
              <TextField
                id="name"
                label="Name"
                sx={useStyles.textField}
                value={values.name}
                onChange={handleChange('name')}
                margin="normal"
              />
              <TextField
                id="email"
                type="email"
                label="Email"
                sx={useStyles.textField}
                value={values.email}
                onChange={handleChange('email')}
                margin="normal"
              />
              <TextField
                id="password"
                type="password"
                label="Password"
                sx={useStyles.textField}
                value={values.password}
                onChange={handleChange('password')}
                margin="normal"
              />
              <TextField
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                sx={useStyles.textField}
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                margin="normal"
              />
              <TextField
                id="securityQuestion"
                label="Security Question"
                sx={useStyles.textField}
                value={values.securityQuestion}
                onChange={handleChange('securityQuestion')}
                margin="normal"
                helperText="e.g., What is your mother's maiden name?"
              />
              <TextField
                id="securityAnswer"
                label="Security Answer"
                sx={useStyles.textField}
                value={values.securityAnswer}
                onChange={handleChange('securityAnswer')}
                margin="normal"
              />
              {values.error && (
                <Typography component="p" color="error">
                  {values.error}
                </Typography>
              )}
              <Button 
                variant="contained" 
                onClick={clickSubmit} 
                sx={useStyles.submit}
                fullWidth={isMobile}
              >
                Sign up
              </Button>
              <Typography component="p" color="#000000" sx={useStyles.linkText}>
                Have an account? <Link to="/signin">Login</Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={useStyles.imageContainer}>
          <Box
            component="img"
            sx={useStyles.image}
            alt="Healthy food"
            src={loginpage}
          />
        </Grid>
      </Grid>
      
      {/* Success Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">
          {"Account Created Successfully"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your new account has been successfully created. Click OK to proceed to the sign-in page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}