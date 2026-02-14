import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import AppContext from "../context/AppContext";

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { token, backendUrl, navigate } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        toast.error("You must be logged in to add a student.");
        return;
      }
      const { data } = await axios.post(`${backendUrl}/students`, student, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setStudent({
          name: "",
          email: "",
          phone: "",
        });
        setLoading(false);
        navigate("/");
        return;
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

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form
        className="border flex flex-col gap-4 p-4 rounded-2xl shadow-md bg-white"
        onSubmit={onSubmitHandler}
      >
        <p className="text-2xl font-semibold text-center text-gray-800">
          New Student
        </p>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Name</label>
          <input
            className="px-3 py-2 outline-none rounded border border-gray-300 focus:border-black transition-colors"
            type="text"
            name="name"
            value={student.name}
            placeholder="John Doe"
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="px-3 py-2 outline-none rounded border border-gray-300 focus:border-black transition-colors"
            name="email"
            type="email"
            value={student.email}
            placeholder="john@example.com"
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Phone</label>
          <input
            className="px-3 py-2 outline-none rounded border border-gray-300 focus:border-black transition-colors"
            type="tel"
            name="phone"
            value={student.phone}
            placeholder="+1 234 567 890"
            onChange={onChangeHandler}
            required
          />
        </div>

        <button
          className="mt-2 px-3 py-2 rounded bg-black text-white font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
