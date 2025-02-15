import { signout } from './api-auth.js';

const auth = {
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    try {
      const storedJwt = sessionStorage.getItem('jwt');
      if (storedJwt) {
        const parsedJwt = JSON.parse(storedJwt);
        // Add any validation logic for JWT if necessary (expiration, etc.)
        return parsedJwt;
      }
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return false;
    }
    return false;
  },

  authenticate(jwt, cb) {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem('jwt', JSON.stringify(jwt));
        cb(); // Callback to trigger any post-authentication actions
      } catch (error) {
        console.error("Error storing JWT:", error);
      }
    }
  },

  clearJWT(cb) {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem('jwt');
        cb(); // Callback to trigger any post-signout actions
        signout().then((data) => {
          // Remove any cookies or session data if necessary
          document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }).catch(error => {
          console.error("Error during signout:", error);
        });
      } catch (error) {
        console.error("Error clearing JWT:", error);
      }
    }
  },
  // isAdmin() {
  //   const jwt = this.isAuthenticated();
  //   return jwt && jwt.user && jwt.user.role === 'admin';
  // }
};

export default auth;
