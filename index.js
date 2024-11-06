const { initializeDb } = require(`./db`);
const express = require("express");

const app = express();

app.use(express.json());

const Recipe = require("./models/recipe.models");

initializeDb();

app.get('/',(req,res)=>{
    res.send('Recipies backend app.')
})

app.get("/recipes",async(req,res)=>{
  try{
    const recipes = await getAllRecipes();
    res.status(200).json({Recipe: recipes})
  }catch(error){
    res.status(500).json({error:"error fetching books"})
  }
})

app.get("/recipes/title/:recipeTitle", async (req,res)=>{
  try{
    const recipe = await getRecipeByTitle(req.params.recipeTitle);
    if(recipe.length>0) res.status(200).json({recipe});
    else res.status(400).json({error:"error finding recipe details"})
  }catch(error){
    res.status(500),json({error:"Error getting recipe "})
  }
})

app.get("/recipes/difficulty/:difficult", async (req,res)=>{
  try{
    const recipe = await getBookByDifficulty(req.params.difficult);
    if(recipe.length>0) res.status(200).json({recipe});
    else res.status(400).json({error:"error finding recipe details"})
  }catch(error){
    res.status(500),json({error:"Error getting recipe "})
  }
})


app.get("/recipes/author/:author", async (req,res)=>{
  try{
    const recipe = await getRecipeByAuthor(req.params.author);
    if(recipe.length>0) res.status(200).json({recipe});
    else res.status(400).json({error:"error finding recipe details"})
  }catch(error){
    res.status(500),json({error:"Error getting recipe "})
  }
})

app.post('/recipes', async (req,res)=>{
  try{
    const newRecipe = await createRecipe(req.body);
    if(newRecipe) res.status(201).json({message:"Recipe created successfully", recipe: newRecipe});
    else res.status(400).json({error:"new recipe couldn't be added"})
  }catch(error){
    res.status(500).json({error:"Error adding data of new recipe"})
  }
})


app.post("/recipes/:recipeId", async (req,res)=>{
  try{
    const updatedRecipe = await updateRecipeById(req.params.recipeId, req.body);
    if(updatedRecipe) res.status(200).json({"updated recipe": req.body });
    else res.status(400).json({error:"Recipe not found"})
  }catch(error){
    res.status(500).json({error:"error updating recipe"})
  }
})

app.post("/recipes/title/:recipeTitle", async (req,res)=>{
  try{
    const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body);
    if(updatedRecipe) res.status(200).json({"updated recipe": req.body });
    else res.status(400).json({error:"Recipe not found"})
  }catch(error){
    res.status(500).json({error:"error updating Book"})
  }
})

app.delete("/recipes/:recipeId", async (req,res)=>{
  try{
    const deletedRecipe = await deleteRecipeById(req.params.recipeId);
    if(deletedRecipe) res.status(200).json({message:"recipe deleted successfully",recipe: deletedRecipe});
    else res.status(400).json({error:"recipe not found"});
  }catch(error){
    res.status(500),json({error:"Error while deleting the recipe"})
  }
})
async function getAllRecipes(){
  try{
    const recipes = await Recipe.find();
    return recipes;
  }catch(error){
    throw error;
  }
}

async function getRecipeByTitle(title){
  try{
    const recipe = await Recipe.find({title});
    return recipe;
  }catch(error){
    throw error;
  }
}

async function getRecipeByAuthor(author){
  try{
    const book = await Recipe.find({author});
    return book;
  }catch(error){
    throw error;
  }
}

async function getBookByDifficulty(difficulty){
  try{
    const recipe = await Recipe.find({difficulty});
    return recipe;
  }catch(error){
    throw error;
  }
}



async function updateRecipeById(recipeId, dataToUpdate){
  try{
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new:true});
    return updatedRecipe; 
  }catch(error){
    throw error;
  }
}

async function updateRecipeByTitle(title, dataToUpdate){
  try{
    const updatedRecipe = await Recipe.findOneAndUpdate({title}, dataToUpdate, {new:true});
    return updatedRecipe; 
  }catch(error){
    console.log(error);
    throw error;
  }
}

async function deleteRecipeById(recipeId){
  try{
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  }catch(error){
    throw error;
  }
}

async function createRecipe(newRecipe){
  try{
    const recipe = new Recipe(newRecipe);
    const savedRecipe = await recipe.save();
    return savedRecipe;
  }catch(error){
    throw error;
  }
}

app.listen(3000, ()=> console.log("Server is running on port 3000"));