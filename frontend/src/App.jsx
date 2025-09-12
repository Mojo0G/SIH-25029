import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/layout";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AdminUsersPage from "./pages/admin";
import GetResultPage from "./pages/getresult";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
      </Route>
      <Route path="/admin" element={<AdminUsersPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/getresult" element={<GetResultPage />} />
    </Routes>
  );
}

export default App;
