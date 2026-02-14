import { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { FaTrash, FaCheck, FaXmark } from "react-icons/fa6";

const StudentCard = ({ student, index }) => {
  const { backendUrl, token, setStudents } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: student.name || "",
    email: student.email || "",
    phone: student.phone || "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const onCancel = () => {
    setIsEditing(false);
    setEditData({
      name: student.name,
      email: student.email,
      phone: student.phone,
    });
  };

  const onSaveHandler = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/students/${student._id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        setIsEditing(false);
        setStudents((prev) =>
          prev.map((item) =>
            item._id === student._id ? { ...item, ...editData } : item,
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
    if (!window.confirm("Are you sure you want to remove this student?"))
      return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/students/${student._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        setStudents((prev) => prev.filter((item) => item._id !== student._id));
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
            name="name"
            value={editData.name}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full outline-none focus:border-blue-500 transition-all"
          />
        ) : (
          <div className="text-sm capitalize font-medium text-gray-900">
            {student.name}
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={editData.email}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full outline-none focus:border-blue-500 transition-all"
          />
        ) : (
          <div className="text-sm text-gray-600">{student.email}</div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={editData.phone}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-28 outline-none focus:border-blue-500 transition-all"
          />
        ) : (
          <span className="text-sm text-gray-600">{student.phone}</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4 text-lg text-gray-500">
          {isEditing ? (
            <>
              <button onClick={onSaveHandler} title="Save">
                <FaCheck className="text-green-600 hover:text-green-800 transition-colors" />
              </button>
              <button onClick={onCancel} title="Cancel">
                <FaXmark className="text-red-500 hover:text-red-700 transition-colors" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} title="Edit">
                <FaEdit className="text-blue-600 hover:text-blue-800 transition-colors" />
              </button>
              <button onClick={onDeleteHandler} title="Delete">
                <FaTrash className="text-red-600 hover:text-red-800 transition-colors" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default StudentCard;
