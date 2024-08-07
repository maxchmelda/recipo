import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { Discover, Login, Register, AboutUs, Cookbook, CreateRecipe, Profile, Recipe } from './pages'

function App() {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login login={login} />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Discover /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-recipe"
          element={isLoggedIn ? <CreateRecipe /> : <Navigate to="/login" />}
        />
        <Route
          path="/cookbook"
          element={isLoggedIn ? <Cookbook /> : <Navigate to="/login" />}
        />
        <Route
          path="/about-us"
          element={isLoggedIn ? <AboutUs /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/recipe"
          element={isLoggedIn ? <Recipe /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
