import auth from "../lib/auth-helper"; 

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

export const updateUserSecurity = async (userId, { securityQuestion, securityAnswerPlain }) => {
    try {
      const response = await fetch(`/api/users/${userId}/security`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.isAuthenticated().token}`,
        },
        body: JSON.stringify({ securityQuestion, securityAnswerPlain }),
      });
      return await response.json();
    } catch (err) {
      return { error: "Could not update security question/answer" };
    }
  };

export const updateUserPassword = async (userId, { password }) => {
  try {
    const response = await fetch(`/api/users/${userId}/password`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.isAuthenticated().token}`,
      },
      body: JSON.stringify({ password }),
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
  export const removeUserAsAdmin = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/admin`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.isAuthenticated().token}`,
        },
        body: JSON.stringify({ admin: false }),
      });
      return await response.json();
    } catch (err) {
      return { error: "Could not update admin status" };
    }
  };

  export const getRecipesByUser = async (creator) => {
    try {
      const response = await fetch(`/api/recipes/creator/${encodeURIComponent(creator)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.isAuthenticated().token}`,
        },
      });
      return await response.json();
    } catch (err) {
      return { error: "Could not fetch recipes" };
    }
  };

export const deleteRecipeComment = async (recipeId, commentId) => {
  try {
    const response = await fetch(`/api/recipes/${recipeId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.isAuthenticated().token}`,
      },
    });
    return await response.json();
  } catch (err) {
    return { error: "Could not delete comment" };
  }
};