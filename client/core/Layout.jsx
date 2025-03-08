import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import auth from "../lib/auth-helper";
import "./Layout.css";
import logo from "../src/assets/FreshPlate-logo.png";

const isActive = (location, path) => {
  return location.pathname === path
    ? { borderBottom: "2px solid #ff0000" , color:"black"}
    : { color: "#000" };
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app-container" style={{backgroundColor:'#000000'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="#FF6E1C" sx={{ flexGrow: 1 }}>
            <Button component={Link} to={auth.isAuthenticated() ? "/member" : "/"} 
              color="inherit">
              <img src={logo} alt="FlavorHub-Logo" height={20} />
            </Button>
          </Typography>
          {!auth.isAuthenticated() && (
            <>
              <Button
                component={Link}
                to="/"
                color="inherit"
                style={isActive(location, "/")}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/about"
                color="inherit"
                style={isActive(location, "/about")}
              >
                About Us
              </Button>
              <Button
                component={Link}
                to="/contact"
                color="inherit"
                style={isActive(location, "/contact")}
              >
                Contact
              </Button>
              <Button
                component={Link}
                to="/signin"
                color="inherit"
                style={isActive(location, "/signin")}
                sx={{
                  border: "2px solid red",
                  marginLeft: "5px",
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                style={isActive(location, "/signup")}
                sx={{
                  border: "2px solid red",
                  backgroundColor: "red",
                  color: "whitesmoke !important",
                  marginLeft: "5px"
                }}
              >
                Register
              </Button>
            </>
          )}
          {auth.isAuthenticated() && (
            <>
              <Button
                component={Link}
                to="/member"
                color="inherit"
                style={isActive(location, "/member")}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/account"
                color="inherit"
                style={isActive(location, "/account")}
              >
                Account
              </Button>
              <Button
                component={Link}
                to="/recipelist"
                color="inherit"
                style={isActive(location, "/recipelist")}
              >
                Recipes
              </Button>
              <Button
                component={Link}
                to="/about"
                color="inherit"
                style={isActive(location, "/about")}
              >
                About Us
              </Button>
              <Button
                component={Link}
                to="/contact"
                color="inherit"
                style={isActive(location, "/contact")}
              >
                Contact
              </Button>
              {/* Conditionally render the admin menu item */}
              {auth.isAuthenticated().user && auth.isAuthenticated().user.admin && (
                <Button
                  component={Link}
                  to="/admin"
                  color="inherit"
                  style={isActive(location, "/admin")}
                >
                  Admin
                </Button>
              )}
              <Button
                color="inherit"
                style={isActive(location, "/logout")}
                onClick={() => {
                  auth.clearJWT(() => navigate("/"));
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
