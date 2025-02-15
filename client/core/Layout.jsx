// import React from "react";
// import { AppBar, Toolbar, Typography, Button } from "@mui/material";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import auth from "../lib/auth-helper";
// import "./Layout.css";
// import logo from "../src/assets/FreshPlate-logo.png";

// const isActive = (location, path) => {
//   return location.pathname === path
//     ? { color: "#FF6E1C" }
//     : { color: "#000000" };
// };

// export default function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <div className="app-container">
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" color="#FF6E1C" sx={{ flexGrow: 1 }}>
//             <Button component={Link} to="/" color="inherit">
//               <img src={logo} alt="FreshPlate-Logo" height={20} />
//             </Button>
//           </Typography>
//           <Button
//             component={Link}
//             to="/"
//             color="inherit"
//             style={isActive(location, "/")}
//           >
//             Home
//           </Button>
//           {/* for testing */}
//           {/* <Button
//             component={Link}
//             to="/account"
//             color="inherit"
//             style={isActive(location, "/account")}
//           >
//             Account
//           </Button> */}
//           <Button
//             component={Link}
//             to="/about"
//             color="inherit"
//             style={isActive(location, "/about")}
//           >
//             About Us
//           </Button>
//           <Button
//             component={Link}
//             to="/contact"
//             color="inherit"
//             style={isActive(location, "/contact")}
//           >
//             Contact
//           </Button>
//           {!auth.isAuthenticated() && (
//             <>
//               <Button
//                 component={Link}
//                 to="/signin"
//                 color="inherit"
//                 style={isActive(location, "/signin")}
//               >
//                 Sign In
//               </Button>
//               <Button
//                 component={Link}
//                 to="/signup"
//                 color="inherit"
//                 style={isActive(location, "/signup")}
//               >
//                 Register
//               </Button>
//             </>
//           )}
//           {auth.isAuthenticated() && (
//             <>
//               <Button
//                 component={Link}
//                 to="/account"
//                 color="inherit"
//                 style={isActive(location, "/account")}
//               >
//                 Account
//               {/* </Button>
//               <Button
//                 component={Link}
//                 to="/about"
//                 style={isActive(location, "/about")}
//               >
//                 About Us
//               </Button>
//               <Button
//                 component={Link}
//                 to="/contact"
//                 style={isActive(location, "/contact")}
//               >
//                 Contact */}
//               </Button>
//               <Button
//                 color="inherit"
//                 style={isActive(location, "/logout")}
//                 onClick={() => {
//                   auth.clearJWT(() => navigate("/"));
//                 }}
//               >
//                 Logout
//               </Button>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//     </div>
//   );
// }

import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import auth from "../lib/auth-helper";
import "./Layout.css";
import logo from "../src/assets/FreshPlate-logo.png";

const isActive = (location, path) => {
  return location.pathname === path
    ? { backgroundColor: "#FF6E1C" }
    : { color: "#000000" };
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
              <img src={logo} alt="FreshPlate-Logo" height={20} />
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
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                color="inherit"
                style={isActive(location, "/signup")}
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
