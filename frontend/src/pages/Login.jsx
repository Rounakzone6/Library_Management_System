import axios from "axios";
import { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("register");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { backendUrl, setToken, navigate } = useContext(AppContext);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        state === "register" ? "/admin/register" : "/admin/login";
      const payload =
        state === "register"
          ? user
          : { email: user.email, password: user.password };

      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        setUser({
          name: "",
          email: "",
          password: "",
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
    <form
      className="max-w-md w-full flex flex-col gap-4 border border-gray-200 shadow rounded-2xl p-6 mx-auto mt-20"
      onSubmit={onSubmitHandler}
    >
      <p className="font-medium text-center text-2xl">
        {state === "register" ? "Create Account" : "Welcome Back"}
      </p>

      {state === "register" && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={user.name}
            onChange={onChangeHandler}
            required
            className="px-3 py-2 rounded border border-gray-200 outline-none focus:border-black transition-colors"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          value={user.email}
          onChange={onChangeHandler}
          required
          className="px-3 py-2 rounded border border-gray-200 outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          value={user.password}
          onChange={onChangeHandler}
          required
          className="px-3 py-2 rounded border border-gray-200 outline-none focus:border-black transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-3 py-2 cursor-pointer rounded bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        {loading
          ? "Please wait..."
          : state === "register"
            ? "Sign Up"
            : "Sign In"}
      </button>

      <div className="text-center text-sm mt-2">
        {state === "register" ? (
          <p>
            Already have an Account?{" "}
            <span
              className="text-blue-500 underline cursor-pointer hover:text-blue-700"
              onClick={() => setState("login")}
            >
              Login
            </span>
          </p>
        ) : (
          <p>
            Don't have an Account?{" "}
            <span
              className="text-blue-500 underline cursor-pointer hover:text-blue-700"
              onClick={() => setState("register")}
            >
              Register
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
