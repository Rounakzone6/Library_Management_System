import { useEffect, useMemo, useState } from "react";
import AppContext from "./AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ContextProvider = (props) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const [booksRes, studentsRes] = await Promise.all([
          axios.get(`${backendUrl}/books`, config),
          axios.get(`${backendUrl}/students`, config),
        ]);

        if (booksRes.data.success) {
          setBooks(booksRes.data.books);
        } else {
          toast.error(booksRes.data.message);
        }

        if (studentsRes.data.success) {
          setStudents(studentsRes.data.students);
        } else {
          toast.error(studentsRes.data.message);
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          setToken("");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && backendUrl) fetchData();
  }, [token, backendUrl, navigate]);

  const value = useMemo(
    () => ({
      token,
      backendUrl,
      books,
      students,
      loading,
      setToken,
      setBooks,
      setStudents,
      navigate,
    }),
    [backendUrl, books, students, loading, token, navigate],
  );

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default ContextProvider;
