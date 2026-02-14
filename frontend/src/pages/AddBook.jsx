import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import AppContext from "../context/AppContext";

const AddBook = () => {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    copies: "",
  });

  const { backendUrl, token, navigate } = useContext(AppContext);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/books`, book, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        setBook({
          title: "",
          author: "",
          category: "",
          copies: "",
        });
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        className="border p-4 rounded-2xl flex flex-col gap-4 shadow-md bg-white"
        onSubmit={onSubmitHandler}
      >
        <h2 className="text-xl font-semibold text-center">Add New Book</h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Title</label>
          <input
            type="text"
            name="title"
            value={book.title}
            placeholder="e.g. The Great Gatsby"
            onChange={onChangeHandler}
            required
            className="px-3 py-2 outline-none rounded border border-gray-300 focus:border-black transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Author</label>
          <input
            type="text"
            name="author"
            value={book.author}
            placeholder="e.g. F. Scott Fitzgerald"
            onChange={onChangeHandler}
            required
            className="px-3 py-2 outline-none rounded border border-gray-300 focus:border-black transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Category</label>
          <input
            type="text"
            name="category"
            value={book.category}
            placeholder="e.g. Classic Fiction"
            onChange={onChangeHandler}
            required
            className="px-3 py-2 outline-none rounded border border-gray-300 focus:border-black transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Copies Available</label>
          <input
            type="number"
            name="copies"
            value={book.copies}
            placeholder="e.g. 5"
            onChange={onChangeHandler}
            required
            min="1"
            className="px-3 py-2 outline-none rounded border border-gray-300 focus:border-black transition-colors"
          />
        </div>
        <button
          disabled={loading}
          className="mt-2 px-3 py-2 rounded bg-black text-white font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
