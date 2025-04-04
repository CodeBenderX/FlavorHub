import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Drawer,
  Box,
  List,
  ListItem,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import auth from "../lib/auth-helper";
import "./Layout.css";
import logo from "../src/assets/FreshPlate-logo.png";

const isActive = (location, path) => {
  return location.pathname === path
    ? { borderBottom: "2px solid #DA3743", color: "black" }
    : { color: "#000" };
};

const Path = props => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle, isOpen }) => (
  <IconButton 
    onClick={toggle}
    sx={{
      outline: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '12px',
    }}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5", stroke: "black" },
          open: { d: "M 3 16.5 L 17 2.5", stroke: "black" }
        }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346", stroke: "black" },
          open: { d: "M 3 2.5 L 17 16.346", stroke: "black" }
        }}
        animate={isOpen ? "open" : "closed"}
      />
    </svg>
  </IconButton>
);

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderDesktopMenu = () => {
    const commonItems = [
      { path: "/", label: "Home", show: !auth.isAuthenticated() },
      { path: "/member", label: "Home", show: auth.isAuthenticated() },
      { path: "/about", label: "About Us", show: true },
      { path: "/contact", label: "Contact", show: true },
      { path: "/account", label: "Account", show: auth.isAuthenticated() },
      { path: "/recipelist", label: "Recipes", show: auth.isAuthenticated() },
      { path: "/admin", label: "Admin", show: auth.isAuthenticated()?.user?.admin }
    ];

    const authItems = !auth.isAuthenticated() ? [
      { path: "/signin", label: "Sign In", sx: { border: "2px solid #DA3743" } },
      { 
        path: "/signup", 
        label: "Register", 
        sx: { 
          border: "2px solid #DA3743",
          backgroundColor: "#DA3743",
          color: "whitesmoke !important",
          ml: 1
        }
      }
    ] : [
      { 
        path: "/logout", 
        label: "Logout", 
        onClick: () => auth.clearJWT(() => navigate("/")),
        sx: { ml: 2 }
      }
    ];

    return (
      <>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {commonItems
            .filter(item => item.show)
            .map(item => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                style={isActive(location, item.path)}
              >
                {item.label}
              </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {authItems.map(item => (
            <Button
              key={item.path}
              component={item.onClick ? undefined : Link}
              to={item.onClick ? undefined : item.path}
              color="inherit"
              style={isActive(location, item.path)}
              onClick={item.onClick}
              sx={item.sx}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </>
    );
  };

  const renderMobileMenu = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: mobileOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '250px',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(5px)',
        zIndex: theme.zIndex.drawer + 1,
        padding: '24px',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 3
      }}>
        <MenuToggle toggle={handleDrawerToggle} isOpen={mobileOpen} />
      </Box>
      
      <List>
        {[
          { path: auth.isAuthenticated() ? "/member" : "/", label: "Home" },
          { path: "/about", label: "About Us" },
          { path: "/contact", label: "Contact" },
          ...(!auth.isAuthenticated() ? [
            { path: "/signin", label: "Sign In" },
            { path: "/signup", label: "Register" }
          ] : [
            { path: "/account", label: "Account" },
            { path: "/recipelist", label: "Recipes" },
            ...(auth.isAuthenticated().user?.admin ? 
              [{ path: "/admin", label: "Admin" }] : []),
            { 
              path: "/logout", 
              label: "Logout", 
              onClick: () => auth.clearJWT(() => navigate("/")) 
            }
          ])
        ].map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <Button
                fullWidth
                component={item.onClick ? undefined : Link}
                to={item.onClick ? undefined : item.path}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  handleDrawerToggle();
                }}
                sx={{ 
                  ...isActive(location, item.path),
                  py: 2,
                  px: 3,
                  justifyContent: 'flex-start',
                  ...(item.path === "/signup" ? {
                    backgroundColor: "#DA3743",
                    color: "white !important",
                    '&:hover': { backgroundColor: "#DA3743" }
                  } : {}),
                  ...(item.path === "/signin" ? {
                    border: "2px solid #DA3743"
                  } : {})
                }}
              >
                {item.label}
              </Button>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </motion.div>
  );

  return (
    <div className="app-container">
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Button 
            component={Link} 
            to={auth.isAuthenticated() ? "/member" : "/"} 
            color="inherit" 
            sx={{ 
              '&:hover': { backgroundColor: 'transparent' },
              p: 1,
              minWidth: 'auto'
            }}
          >
            <img src={logo} alt="FreshPlate Logo" height={20} />
          </Button>

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderDesktopMenu()}
            </Box>
          ) : (
            <MenuToggle toggle={handleDrawerToggle} isOpen={mobileOpen} />
          )}
        </Toolbar>
      </AppBar>

      {isMobile && renderMobileMenu()}
    </div>
  );
}