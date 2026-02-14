import { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import { MdAddShoppingCart, MdCheckCircle, MdSearch } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

const AssignBook = () => {
  const { books, backendUrl, token, setBooks } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [student, setStudent] = useState(null);

  const [selectedBooks, setSelectedBooks] = useState([]);

  const onSearchHandler = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error("Please enter a phone number");

    try {
      setSearchLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/students/phone/${phone}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        setStudent(data.student);
        toast.success(`Student found: ${data.student.name}`);
      } else {
        setStudent(null);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error searching student");
    } finally {
      setSearchLoading(false);
    }
  };

  const onBookToggle = (bookId, copies) => {
    if (copies < 1) return toast.error("This book is out of stock");

    if (selectedBooks.includes(bookId)) {
      setSelectedBooks((prev) => prev.filter((id) => id !== bookId));
    } else {
      setSelectedBooks((prev) => [...prev, bookId]);
    }
  };

  const onSubmitHandler = async () => {
    if (!student) return toast.error("Please search for a student first");
    if (selectedBooks.length === 0)
      return toast.error("Please select at least one book");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/books/issue`,
        { studentId: student._id, bookIds: selectedBooks },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);

        setBooks((prev) =>
          prev.map((book) => {
            if (selectedBooks.includes(book._id)) {
              return { ...book, copies: Number(book.copies) - 1 };
            }
            return book;
          }),
        );

        setStudent(null);
        setPhone("");
        setSelectedBooks([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Assign Books</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <form onSubmit={onSearchHandler} className="flex gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1 max-w-md">
            <label className="text-sm font-medium text-gray-600">
              Student Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number..."
              className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-black transition-colors w-full"
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
          >
            {searchLoading ? (
              "Searching..."
            ) : (
              <>
                <MdSearch size={20} /> Search
              </>
            )}
          </button>
        </form>
        {student && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-green-900">{student.name}</p>
              <p className="text-sm text-green-700">{student.email}</p>
              <p className="text-sm text-green-700">Phone: {student.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                Active Student
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mb-20">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Select Books to Issue{" "}
          {selectedBooks.length > 0 && `(${selectedBooks.length})`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => {
            const isSelected = selectedBooks.includes(book._id);
            const isOutOfStock = book.copies < 1;

            return (
              <div
                key={book._id}
                onClick={() =>
                  !isOutOfStock && onBookToggle(book._id, book.copies)
                }
                className={`
                  relative p-4 rounded-xl border cursor-pointer transition-all duration-200
                  ${isSelected ? "border-green-500 bg-green-50 ring-1 ring-green-500" : "border-gray-200 bg-white hover:shadow-md"}
                  ${isOutOfStock ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-green-600">
                    <MdCheckCircle size={24} />
                  </div>
                )}
                {!isSelected && !isOutOfStock && (
                  <div className="absolute top-3 right-3 text-gray-400">
                    <MdAddShoppingCart size={24} />
                  </div>
                )}

                <h3 className="font-semibold text-gray-800 pr-8 truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {book.author}
                </p>
                <div className="mt-3 flex justify-between items-center text-xs font-medium">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {book.category}
                  </span>
                  <span
                    className={`${isOutOfStock ? "text-red-500" : "text-gray-600"}`}
                  >
                    {isOutOfStock ? "Out of Stock" : `${book.copies} Copies`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selectedBooks.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg flex justify-end items-center gap-4 z-50">
          <div className="mr-auto pl-4 md:pl-64">
            <span className="font-medium text-gray-600">Issuing to: </span>
            <span className="font-bold text-black">
              {student ? student.name : "Select Student"}
            </span>
          </div>
          <button
            onClick={() => setSelectedBooks([])}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Clear Selection
          </button>
          <button
            onClick={onSubmitHandler}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors shadow-lg"
          >
            {loading ? "Processing..." : `Issue ${selectedBooks.length} Books`}
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignBook;
