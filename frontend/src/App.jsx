import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/layout";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AdminUsersPage from "./pages/admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
      </Route>
      <Route path="/admin" element={<AdminUsersPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
