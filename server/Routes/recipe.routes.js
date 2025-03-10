import express from 'express'
import recipeCtrl from '../Controllers/recipe.controller.js'
import authCtrl from '../Controllers/auth.controller.js'

const router = express.Router()

router.route('/api/recipes')
  .post(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.createRecipe)
  .get(recipeCtrl.getAllRecipes)

  router.route('/api/recipes/updateCreator')
  .put(authCtrl.requireSignin, authCtrl.setUser,recipeCtrl.updateCreator);

  router.route('/api/recipes/user/:name')
  .delete(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.deleteUserRecipes)

router.route('/api/recipes/transfer/:name')
  .put(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.transferRecipesToAdmin)
  
router.route('/api/recipes/:recipeId')
  .get(authCtrl.requireSignin, recipeCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.updateRecipe)
  .delete(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.deleteRecipe)

// NEW: Add a comment to a specific recipe
router.route('/api/recipes/:recipeId/comments')
  .post(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.addComment)

router.route('/api/recipes/creator/:name')
  .get(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.getRecipesByCreator);


router.route('/api/recipes/:recipeId/comments/:commentId')
  .delete(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.deleteComment);

router.param('recipeId', recipeCtrl.recipeByID)

export default router