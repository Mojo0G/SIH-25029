import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/layout";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AdminUsersPage from "./pages/admin";
import Analyze from "./pages/analyze";
import AnalyzeDetail from "./pages/analyzeDetail";
import AnalyzeCheck from "./pages/analyzeCheck";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
      </Route>
      <Route path="/admin" element={<AdminUsersPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/analyze/:id" element={<AnalyzeDetail />} />
      <Route path="/analyze/check" element={<AnalyzeCheck />} />
    </Routes>
  );
}

export default App;
