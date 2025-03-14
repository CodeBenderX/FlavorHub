import auth from "../lib/auth-helper";

const create = async (credentials, recipe) => {
  try {
    let response = await fetch('/api/recipes/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + credentials.t
      },
      body: recipe
    });
    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (err) {
    console.error('Error creating recipe:', err);
    throw err;
  }
};

const list = async (credentials) => {
  try {
    let response = await fetch('/api/recipes/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching recipes:', err);
    throw err;
  }
};

const read = async (params, credentials) => {
  try {
    let response = await fetch('/api/recipes/' + params.recipeId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const update = async (params, credentials, recipe) => {
  try {
    let response = await fetch('/api/recipes/' + params.recipeId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: recipe

    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/recipes/' + params.recipeId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Error deleting recipe:', err);
    throw err;
  }
};

const updateRecipeCreators = async (data, credentials) => {
  try {
    let response = await fetch('/api/recipes/updateCreator', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Server responded with an error');
    }
    return result;
  } catch (err) {
    console.error('Error in updateRecipeCreators:', err);
    throw new Error(`Failed to update recipe creators: ${err.message}`);
  }
};

const deleteUserRecipes = async (params, credentials) => {
  try {
    let response = await fetch(`/api/recipes/user/${params.name}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });
    return await response.json();
  } catch (err) {
    console.error('Error in deleteUserRecipes:', err);
    throw err;
  }
};

const transferRecipesToAdmin = async (params, credentials) => {
  try {
    let response = await fetch(`/api/recipes/transfer/${params.name}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });
    return await response.json();
  } catch (err) {
    console.error('Error in transferRecipesToAdmin:', err);
    throw err;
  }
};

// Update a comment on a recipe
const updateRecipeComment = async (recipeId, commentId, { text, rating }) => {
  try {
    const response = await fetch(`/api/recipes/${recipeId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.isAuthenticated().token}`,
        //'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({ text, rating }),
    });
    return await response.json();
  } catch (err) {
    return { error: "Could not update comment" };
  }
};

// Delete a comment from a recipe
const deleteRecipeComment = async (recipeId, commentId) => {
  try {
    const response = await fetch(`/api/recipes/${recipeId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.isAuthenticated().token}`,
        //'Authorization': 'Bearer ' + credentials.t
      },
    });
    const data = await response.json();
    if (!response.ok) {
      // Throw an error with details returned by the server
      throw new Error(data.error || "Could not delete comment");
    }
    return data;
  } catch (err) {
    return { error: err.message || "Could not delete comment" };
  }
};

//List Recipe by Ingredient - used to implement the api code that Byron created in back end
const listByIngredient = async (params, token, signal) => {
  try {
    const response = await fetch(`/api/recipes/ingredient=${params.ingredient}`, {
      method: "GET",
      signal,
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  } catch (err) {
    console.error(err);
  }
};

const listByCreator = async (params, token, signal) => {
  try {
    const response = await fetch(`/api/recipes/creator/${params.name}`, {
      method: "GET",
      signal,
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  } catch (err) {
    console.error(err);
  }
};

export { create, list, read, update, remove, updateRecipeCreators, deleteUserRecipes, transferRecipesToAdmin, updateRecipeComment, deleteRecipeComment, listByIngredient, listByCreator }