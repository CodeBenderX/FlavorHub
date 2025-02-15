// import React, { useState } from 'react';
// import { Card, CardContent, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom';
// import { create } from './api-user';

// const useStyles = {
//   card: {
//     maxWidth: 600,
//     margin: 'auto',
//     textAlign: 'center',
//     marginTop: 5,
//     paddingBottom: 2
//   },
//   error: {
//     verticalAlign: 'middle'
//   },
//   title: {
//     marginTop: 2,
//     color: '#FF6E1C'
//   },
//   textField: {
//     marginLeft: 1,
//     marginRight: 1,
//     width: 300
//   },
//   submit: {
//     margin: 'auto',
//     marginBottom: 2
//   }
// };

// export default function Signup() {
//   const [values, setValues] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     error: '',
//     open: false
//   });
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = name => event => {
//     setValues({ ...values, [name]: event.target.value });
//   };

//   const handleClose = () => {
//     setValues({ ...values, open: false });
//     navigate('/signin');
//   };

//   const clickSubmit = () => {
//     if (!values.name || !values.email || !values.password || !values.confirmPassword) {
//       setValues({ ...values, error: "All fields are required" });
//       return;
//     }

//     if (/\d/.test(values.name)) {
//       setValues({ ...values, error: "Name should not contain numbers" });
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
//       setValues({ ...values, error: "Invalid email format" });
//       return;
//     }

//     if (values.password.length < 8) {
//       setValues({ ...values, error: "Password must be at least 8 characters long" });
//       return;
//     }

//     if (values.password !== values.confirmPassword) {
//       setValues({ ...values, error: "Passwords don't match" });
//       return;
//     }

//     const user = {
//       name: values.name || undefined,
//       email: values.email || undefined,
//       password: values.password || undefined
//     };

//     create(user).then(data => {
//         if (data.error) {
//           setValues({ ...values, error: data.error });
//         } else {
//           setValues({ ...values, error: '' });
//           setOpen(true);
//           //navigate('/signin'); // Redirect on successful signup
//         }
//       })
//   };
//   return (
//     <div>
//     <Card sx={useStyles.card}>
//       <CardContent>
//         <Typography variant="h6" sx={useStyles.title}>
//           Create Account
//         </Typography>
//         <TextField
//           id="name"
//           label="Name"
//           sx={useStyles.textField}
//           value={values.name}
//           onChange={handleChange('name')}
//           margin="normal"
//         />
//         <br />
//         <TextField
//           id="email"
//           type="email"
//           label="Email"
//           sx={useStyles.textField}
//           value={values.email}
//           onChange={handleChange('email')}
//           margin="normal"
//         />
//         <br />
//         <TextField
//           id="password"
//           type="password"
//           label="Password"
//           sx={useStyles.textField}
//           value={values.password}
//           onChange={handleChange('password')}
//           margin="normal"
//         />
//         <br />
//         <TextField
//           id="confirmPassword"
//           type="password"
//           label="Confirm Password"
//           sx={useStyles.textField}
//           value={values.confirmPassword}
//           onChange={handleChange('confirmPassword')}
//           margin="normal"
//         />
//         <br />
//         {values.error && (
//           <Typography component="p" color="error">
//             {values.error}
//           </Typography>
//         )}
//         <Button color="primary" variant="contained" onClick={clickSubmit} sx={useStyles.submit}>
//           Submit
//         </Button>
//         <Typography component="p" color="#000000">
//           Have an account? <Link to="/signin">Login</Link>
//         </Typography>
//       </CardContent>
//       </Card>
//       {/* {values.open && (
//         <Typography component="p" color="primary">
//           New account successfully created. <Link to="/signin">Sign In</Link>
//         </Typography>
//       )} */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {"Account Created Successfully"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Your new account has been successfully created. Click OK to proceed to the sign-in page.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary" autoFocus>
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { Card, CardContent, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { create } from './api-user';
import loginpage from '../src/assets/login-signup.jpeg'

const useStyles = {
  card: {
    maxWidth: 500,
    margin: 'auto',
    textAlign: 'center',
    marginTop: 20,
    paddingBottom: 2
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: 2,
    color: '#FF6E1C'
  },
  textField: {
    width: '100%'
  },
  submit: {
    margin: 'auto',
    marginBottom: 2,
    color: '#F5F5F5',
    background: '#000000'
  }
};

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    open: false
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClose = () => {
    setValues({ ...values, open: false });
    navigate('/signin');
  };

  const clickSubmit = () => {
    if (!values.name || !values.email || !values.password || !values.confirmPassword) {
      setValues({ ...values, error: "All fields are required" });
      return;
    }

    if (/\d/.test(values.name)) {
      setValues({ ...values, error: "Name should not contain numbers" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
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
      password: values.password || undefined
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#fff4ea' }}>
      <Grid container spacing={0} sx={{ maxWidth: '100%'}}>
        <Grid item xs={12} md={6}>
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
              {values.error && (
                <Typography component="p" color="error">
                  {values.error}
                </Typography>
              )}
              <Button variant="contained" onClick={clickSubmit} sx={{ ...useStyles.submit, mt: 2 }}>
                Sign up
              </Button>
              <Typography component="p" color="#000000" sx={{ mt: 2 }}>
                Have an account? <Link to="/signin">Login</Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            component="img"
            sx={{
              maxWidth: '100%',
              width: '100%',
              height: '100vh',
              objectFit: 'cover',
            }}
            alt="Healthy food"
            src={loginpage}
          />
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
