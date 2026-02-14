import { FaTrash, FaCheck, FaXmark, FaMinus, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const BookCard = ({ book, index }) => {
  const { backendUrl, token, setBooks } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: book.title || "",
    author: book.author || "",
    category: book.category || "",
    copies: book.copies || 0,
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const decreaseCopies = () => {
    setEditData((prev) => ({
      ...prev,
      copies: Math.max(0, Number(prev.copies) - 1),
    }));
  };

  const increaseCopies = () => {
    setEditData((prev) => ({
      ...prev,
      copies: Number(prev.copies) + 1,
    }));
  };

  const onCancel = () => {
    setIsEditing(false);
    setEditData({
      title: book.title,
      author: book.author,
      category: book.category,
      copies: book.copies,
    });
  };

  const onSaveHandler = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/books/${book._id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        setIsEditing(false);
        setBooks((prev) =>
          prev.map((item) =>
            item._id === book._id ? { ...item, ...editData } : item,
          ),
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onDeleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/books/${book._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setBooks((prev) => prev.filter((item) => item._id !== book._id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200 align-middle">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {index + 1}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full outline-none focus:border-blue-500"
          />
        ) : (
          <div className="text-sm capitalize font-medium text-gray-900">
            {book.title}
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            name="author"
            value={editData.author}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full outline-none focus:border-blue-500"
          />
        ) : (
          <div className="text-sm capitalize text-gray-600">{book.author}</div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        {isEditing ? (
          <input
            type="text"
            name="category"
            value={editData.category}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-28 outline-none focus:border-blue-500"
          />
        ) : (
          <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {book.category}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <button
              onClick={decreaseCopies}
              className="p-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              type="button"
            >
              <FaMinus size={10} />
            </button>
            <input
              type="number"
              name="copies"
              value={editData.copies}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded px-1 py-1 text-sm w-12 text-center outline-none focus:border-blue-500"
            />
            <button
              onClick={increaseCopies}
              className="p-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              type="button"
            >
              <FaPlus size={10} />
            </button>
          </div>
        ) : Number(book.copies) > 0 ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {book.copies} Available
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Out of Stock
          </span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4 text-lg text-gray-500">
          {isEditing ? (
            <>
              <button onClick={onSaveHandler} title="Save">
                <FaCheck className="text-green-600 hover:text-green-800" />
              </button>
              <button onClick={onCancel} title="Cancel">
                <FaXmark className="text-red-500 hover:text-red-700" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} title="Edit">
                <FaEdit className="text-blue-600 hover:text-blue-800" />
              </button>
              <button onClick={onDeleteHandler} title="Delete">
                <FaTrash className="text-red-600 hover:text-red-800" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BookCard;
