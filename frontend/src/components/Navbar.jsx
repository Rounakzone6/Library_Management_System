import { useContext } from "react";
import AppContext from "../context/AppContext";

const Navbar = () => {
  const { navigate } = useContext(AppContext);

  const onClickHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center w-[95%] mx-auto py-3">
      <p onClick={() => navigate("/")} className="text-3xl font-medium">
        Library
      </p>
      <button
        onClick={onClickHandler}
        className="px-3 py-2 rounded-2xl bg-red-600 text-white cursor-pointer font-medium"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
