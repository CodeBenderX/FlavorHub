import Recipe from '../Models/recipe.model.js'
import errorHandler from '../Controllers/error.controller.js'
import formidable from 'formidable';
import fs from 'fs'

const createRecipe = async (req, res) => {
  let form = formidable({ keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Image could not be uploaded",
      });
    }
    Object.keys(fields).forEach((key) => {fields[key] = fields[key][0]});
    // Default the category field to an empty string if not provided
    if (!fields.category) {
      fields.category = "Miscellaneous";}
    Object.keys(files).forEach((key) => {files[key] = files[key][0]});
    let recipe = new Recipe(fields);
    recipe.creator = req.auth.name
    if (files.image) {
      recipe.image.data = fs.readFileSync(files.image.filepath);
      recipe.image.contentType = files.image.mimetype;
    }
    try {
      let result = await recipe.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
  }

  const getAllRecipes = async (req, res) => {
    try {
      let recipes = await Recipe.find().select('title ingredients instructions creator preptime cooktime servings category created updated image');
      
      recipes = recipes.map(recipe => {
        const recipeObj = recipe.toObject();
        if (recipeObj.image && recipeObj.image.data) {
          return {
            ...recipeObj,
            image: {
              contentType: recipeObj.image.contentType,
              data: recipeObj.image.data.toString('base64')
            }
          };
        }
        return recipeObj;
      });
  
      res.json(recipes);
    } catch (err) {
      console.error('Error in getAllRecipes:', err);
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
  };
  
  // [Mar 9, 2025] Byron
  const getRecipesByFilter = async (req, res) => {
    try {
      const ingredientFilter = req.params['ingredient'].split(','); 
      
      console.log(`--- recipe.controllers::getRecipesByFilter - filter: ${ingredientFilter} --- `);

      if (!ingredientFilter) {
        return res.status(400).json({"message": "No ingredient filter specified"})
      }

      /*
      let recipes = await Recipe.find({
        ingredients: new RegExp(ingredientFilter, 'i')
      });
      */
        
      const ingredientsArray = ingredientFilter.map(ingredient => ingredient.trim());
      const regexArray = ingredientsArray.map(ingredient => new RegExp(ingredient, 'i'));
      let recipes = await Recipe.find({
        ingredients: { $in: regexArray }
      });
  
      if (recipes.length === 0) {
        //return res.status(400).json({"message": `No recipes found that matches ingredient filter: ${ingredientFilter}`})
        return res.status(200).json([])
      }
      else {
        recipes = recipes.map(recipe => {
          const recipeObj = recipe.toObject();
          if (recipeObj.image && recipeObj.image.data) {
            return {
              ...recipeObj,
              image: {
                contentType: recipeObj.image.contentType,
                data: recipeObj.image.data.toString('base64')
              }
            };
          }
          return recipeObj;
        });
      }

      res.status(200).json(recipes);
    } 
    catch (err) {
      res.status(500).json({"message": `${err.message}`});
    }
  };  

const recipeByID = async (req, res, next, id) => {
  try {
    let recipe = await Recipe.findById(id)
    if (!recipe)
      return res.status(400).json({
        error: "Recipe not found"
      })
    req.recipe = recipe
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve recipe"
    })
  }
}

const updateRecipe = async (req, res) => {
  const form = formidable({
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }

    let recipe = req.recipe;

    Object.keys(fields).forEach(key => {
      let value = fields[key];
   
      if (Array.isArray(value) && value.length === 1) {
        value = value[0];
      }
  
      if (['preptime', 'cooktime', 'servings'].includes(key) && value === 'null') {
        value = null;
      }

      if (['preptime', 'cooktime', 'servings'].includes(key) && value !== null) {
        value = Number(value);
      }
      recipe[key] = value;
    });

    recipe.updated = Date.now();

    if (files.image && files.image.length > 0) {
      const file = files.image[0];
      recipe.image.data = fs.readFileSync(file.filepath);
      recipe.image.contentType = file.mimetype;
    }

    try {
      let result = await recipe.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
  });
};


const deleteRecipe = async (req, res) => {
  try {
    let recipe = req.recipe;
    if (!recipe) {
      return res.status(404).json({
        error: "Recipe not found"
      });
    }
    
    if (recipe.creator !== req.auth.name) {
      return res.status(403).json({
        error: "User is not authorized to delete this recipe"
      });
    }

    await Recipe.findByIdAndDelete(recipe._id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const photo = (req, res, next) => {
  if (req.recipe.image.data) {
    res.set("Content-Type", req.recipe.image.contentType);
    return res.send(req.recipe.image.data);
  }
  next();
};
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+'../src/assets/defaultFoodImage.png')
};

const read = (req, res) => {
  return res.json(req.recipe)
}

const updateCreator = async (req, res) => {
  try {
    console.log('Received updateCreator request:', req.body);
    const { oldName, newName } = req.body;
    
    if (!oldName || !newName) {
      console.error('Missing oldName or newName in request');
      return res.status(400).json({
        success: false,
        message: 'Both oldName and newName are required'
      });
    }

    const result = await Recipe.updateMany(
      { creator: oldName },
      { $set: { creator: newName } }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      console.log('No recipes found with the old creator name');
      return res.status(404).json({
        success: false,
        message: 'No recipes found with the old creator name'
      });
    }

    res.json({
      success: true,
      message: 'Recipe creators updated successfully',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Error updating recipe creators:', err);
    return res.status(500).json({
      success: false,
      message: errorHandler.getErrorMessage(err)
    });
  }
};

const deleteUserRecipes = async (req, res) => {
  try {
    const userName = req.params.name;
    const result = await Recipe.deleteMany({ creator: userName });
    res.json({
      message: 'User recipes deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const transferRecipesToAdmin = async (req, res) => {
  try {
    const userName = req.params.name;
    const result = await Recipe.updateMany(
      { creator: userName },
      { $set: { creator: 'admin' } }
    );
    res.json({
      message: 'Recipes transferred to admin successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const remove = async (req, res) => {
  try {
    let recipe = req.recipe;
    let deletedRecipe = await recipe.remove();
    res.json(deletedRecipe);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// Controllers/recipe.controller.js (example)
const addComment = async (req, res) => {
  try {
    const recipe = req.recipe; // because of recipeByID
    const { name, email, text, rating } = req.body;

    // Build the new comment object
    const newComment = {
      name,
      email,
      text,
      rating: rating || 0,
      createdAt: new Date()
    };

    // Push to recipe's comments array
    recipe.comments.push(newComment);
    await recipe.save();

    return res.json(recipe); // return updated recipe
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Could not add comment' });
  }
};

// const getRecipesByCreator = async (req, res) => {
//   try {
//     // Find recipes whose "creator" field matches req.params.name
//     const recipes = await Recipe.find({ creator: req.params.name });
//     res.json(recipes);
//   } catch (err) {
//     res.status(400).json({ error: "Could not fetch recipes" });
//   }
// };

const getRecipesByCreator = async (req, res) => {
  try {
    let recipes = await Recipe.find({ creator: { $regex: req.params.name, $options: 'i' } })
      .select("title ingredients instructions creator preptime cooktime servings image");

    // Convert each recipe’s image buffer into a base64 string
    recipes = recipes.map((recipe) => {
      const recipeObj = recipe.toObject();
      if (recipeObj.image && recipeObj.image.data) {
        return {
          ...recipeObj,
          image: {
            contentType: recipeObj.image.contentType,
            data: recipeObj.image.data.toString("base64"),
          },
        };
      }
      return recipeObj;
    });

    res.json(recipes);
  } catch (err) {
    res.status(200).json({ error: "Could not fetch recipes" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { recipeId, commentId } = req.params;
    console.log("Attempting deletion: recipe", recipeId, "comment", commentId);

    // Find the recipe by its ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Find the comment subdocument by ID
    const comment = recipe.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Authorization check: only allow deletion if the authenticated user's email matches the comment's email
    if (req.auth.email !== comment.email) {
      return res.status(403).json({ error: "User not authorized to delete this comment" });
    }


    // Use pull to remove the comment from the array
    recipe.comments.pull(commentId);
    await recipe.save();
    return res.json({ message: "Comment deleted successfully", recipe });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res.status(400).json({ error: "Could not delete comment", details: err.message });
  }
};

const getCommentsByUser = async (req, res) => {
  try {
    const email = req.params.email;
    // Find recipes that contain comments where the comment email matches
    const recipes = await Recipe.find({ "comments.email": email });
    let comments = [];
    recipes.forEach(recipe => {
      // Filter the recipe's comments for those made by the user
      const userComments = recipe.comments.filter(comment => comment.email === email);
      // For each comment, include the recipe title (for context)
      userComments.forEach(comment => {
        comments.push({
          recipeId: recipe._id,
          recipeTitle: recipe.title,
          _id: comment._id,
          name: comment.name,
          email: comment.email,
          text: comment.text,
          rating: comment.rating,
          createdAt: comment.createdAt,
        });
      });
    });
    res.json(comments);
  } catch (err) {
    console.error("Error fetching user comments:", err);
    res.status(400).json({ error: "Could not fetch comments", details: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { recipeId, commentId } = req.params;
    const { text, rating } = req.body;
    
    // Validate the incoming data
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Invalid comment data: text is required" });
    }
    // Optional: Validate rating (if required, here we assume rating must be between 0 and 5)
    if (rating == null || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid comment data: rating must be between 0 and 5" });
    }

    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    // Find the comment subdocument by ID
    const comment = recipe.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Authorization check: only allow update if the authenticated user's email matches the comment's email
    if (req.auth.email !== comment.email) {
      return res.status(403).json({ error: "User not authorized to update this comment" });
    }
    
    // Update the comment properties
    comment.text = text;
    comment.rating = rating;
    
    // Save the recipe to persist changes
    await recipe.save();
    
    res.json({ message: "Comment updated successfully", recipe });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(400).json({ error: "Could not update comment", details: err.message });
  }
};

export default { createRecipe, getAllRecipes, updateRecipe, deleteRecipe, read, defaultPhoto, photo, recipeByID, updateCreator, deleteUserRecipes,
  transferRecipesToAdmin, remove, addComment, getRecipesByCreator, deleteComment, getCommentsByUser, updateComment, getRecipesByFilter };