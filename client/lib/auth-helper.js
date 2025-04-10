import { signout } from './api-auth.js';

const auth = {
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    try {
      const storedJwt = sessionStorage.getItem('jwt');
      if (storedJwt) {
        const parsedJwt = JSON.parse(storedJwt);
        
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
        cb(); 
      } catch (error) {
        console.error("Error storing JWT:", error);
      }
    }
  },

  clearJWT(cb) {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem('jwt');
        cb(); 
        signout().then((data) => {
         
          document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }).catch(error => {
          console.error("Error during signout:", error);
        });
      } catch (error) {
        console.error("Error clearing JWT:", error);
      }
    }
  },
  
};

export default auth;
