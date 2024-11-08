import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { Discover, Login, Register, Cookbook, CreateRecipe, Profile, Recipe } from './pages';

function App() {
  const { isLoggedIn, login, logout } = useAuth();

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

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
          element={isLoggedIn ? <CreateRecipe /> : <Navigate to="/" />}
        />
        <Route
          path="/cookbook"
          element={isLoggedIn ? <Cookbook /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/recipe/:recipeId"
          element={isLoggedIn ? <Recipe /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
