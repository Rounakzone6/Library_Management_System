import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddStudent from "./pages/AddStudent";
import Students from "./pages/Students";
import PageNotFound from "./components/PageNotFound";
import AssignBook from "./pages/AssignBook";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Dashboard />}>
          <Route path="/" element={<Home />} />
          <Route path="/new-record" element={<AssignBook />} />
          <Route path="/new-book" element={<AddBook />} />
          <Route path="/new-student" element={<AddStudent />} />
          <Route path="/books" element={<Books />} />
          <Route path="/students" element={<Students />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
