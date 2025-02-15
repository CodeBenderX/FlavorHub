// import React from "react";
// import { Routes, Route } from "react-router-dom";
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from "../client/core/Layout.jsx";
import Footer from "../client/core/Footer.jsx";


import HomePage from "../client/core/Home.jsx";
import Signin from "./lib/Signin.jsx";
import Signup from "./user/Signup.jsx";
import MemberHome from "./core/MemberHome.jsx";
import MyAccount from "./user/UserAccount.jsx";
import AboutPage from "./components/About.jsx";
import Recipe from "./recipe/Recipe.jsx";
import AddRecipePage from "./recipe/AddRecipe.jsx";
import RecipeList from "./recipe/RecipeList.jsx";
import ContactUsPage from "./components/Contact.jsx";
import EditRecipe from "./recipe/EditRecipe.jsx";
import ViewRecipe from "./recipe/ViewRecipe.jsx";

export default function MainRouter() {
  return (
    <div>
      <Layout/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/member" element={<MemberHome />} />
        <Route path="/recipe" element={<Recipe />} />
        <Route path="/addrecipe" element={<AddRecipePage />} />
        <Route path="/viewrecipe" element={<ViewRecipe />} />
        <Route path="/editrecipe" element={<EditRecipe />} />
        <Route path="/recipelist" element={<RecipeList />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<ContactUsPage />} />
      </Routes>
      <Footer/>
    </div>
  )
}
