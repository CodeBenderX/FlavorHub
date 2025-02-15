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



export { create, list, read, update, remove, updateRecipeCreators, deleteUserRecipes, transferRecipesToAdmin }