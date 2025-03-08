import auth from "../lib/auth-helper"; // Adjust the path based on your project structure

// Fetch all registered users from the backend
export const getAllUsers = async () => {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.isAuthenticated().token}`
      }
    });
    return await response.json();
  } catch (err) {
    return { error: "Could not fetch users" };
  }
};

// Update a user's security question and answer
export const updateUserSecurity = async (userId, { newSecurityQuestion, newSecurityAnswer }) => {
  try {
    const response = await fetch(`/api/users/${userId}/security`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.isAuthenticated().token}`
      },
      body: JSON.stringify({ newSecurityQuestion, newSecurityAnswer })
    });
    return await response.json();
  } catch (err) {
    return { error: "Could not update security question/answer" };
  }
};

// Update a user's password
export const updateUserPassword = async (userId, { newPassword }) => {
  try {
    const response = await fetch(`/api/users/${userId}/password`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.isAuthenticated().token}`
      },
      body: JSON.stringify({ newPassword })
    });
    return await response.json();
  } catch (err) {
    return { error: "Could not update password" };
  }
};
export const setUserAsAdmin = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/admin`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.isAuthenticated().token}`,
        },
        body: JSON.stringify({ admin: true }),
      });
      return await response.json();
    } catch (err) {
      return { error: "Could not update admin status" };
    }
  };