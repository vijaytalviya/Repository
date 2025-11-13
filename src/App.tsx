import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "@/pages/HomePage";
import RepoDetailsPage from "@/pages/RepositoryPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/repository/:name" element={<RepoDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
