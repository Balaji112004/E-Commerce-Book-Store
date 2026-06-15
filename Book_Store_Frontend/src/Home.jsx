import React, { useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { SearchContext } from "./context/SearchContext";
import axios from "axios";
import BookDesign from "./BookDesign";
import Footer from "./Footer";
import banner from "/src/assets/home2.png";

function Home() {
  const { user } = useContext(UserContext);
  const { search } = useContext(SearchContext);

  const [trendingProduct, setTrendingProducts] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [category, setCategory] = useState("");
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [fullBooks, setFullBooks] = useState([]);

  const [open, setOpen] = useState(false);
const [message, setMessage] = useState("");


  const searchScrollRef = useRef(null);
  const trendingScrollRef = useRef(null);
  const hpRef = useRef(null);
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    fetchTrending();
    fetchFullBooks();
    // console.log(user);
  }, []);

  useEffect(() => {
    if (category) fetchCategoryBooks(category);
  }, [category]);

  const fetchTrending = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/trending");
      setTrendingProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching trending books:", err);
    }
  };

  const fetchFullBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/fullBooks");
      setFullBooks(res.data || []);
    } catch (err) {
      console.error("Error fetching full books:", err);
    }
  };

  const fetchCategoryBooks = async (selectedCategory) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/category/${selectedCategory}`
      );
      setCategoryBooks(res.data || []);
    } catch (err) {
      console.error("Error fetching category books:", err);
    }
  };

  const quantityIncrease = () => setQuantity(quantity + 1);
  const quantityDecrease = () => quantity > 1 && setQuantity(quantity - 1);

  const addToCart = async () => {
    if (!user || !user.id) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const payload = {
        userId: user.id,
        productId: selectedBook.id,
        quantity: quantity,
      };
      await axios.post("http://localhost:8080/api/cart", payload);
      alert("Added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Something went wrong while adding to cart.");
    }
  };

  const handleSelect = (e) => setCategory(e.target.value);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount =
        direction === "left"
          ? scrollLeft - clientWidth * 0.7
          : scrollLeft + clientWidth * 0.7;
      ref.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredBooks = fullBooks.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const harryPotter = fullBooks.filter((book) =>
    book.title.toLowerCase().includes("harry")
  );

const submitFeedback = async () => {
  try {
    const res = await axios.post(
      `http://localhost:8080/api/feedback/${user.id}`,
      {
        message: message, // wrap state in object
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    alert("Feedback submitted successfully!");
    setOpen(false);
    setMessage(""); // optional reset

    console.log("Feedback submitted:", res.data);
  } catch (err) {
    console.error("Error submitting feedback:", err);
  }
};


 



  if (selectedBook) {
    return (
      <div className="mx-auto mt-5 p-6 pb-20 bg-white rounded-xl shadow-lg">
        <button
          onClick={() => {
            setSelectedBook(null);
            setQuantity(1);
          }}
          className="mb-8 lg:mb-14 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 justify-center items-start lg:ml-[100px]">

          <img
            src={selectedBook.coverImage}
            alt={selectedBook.title}
            className="lg:h-[470px] h-[320px] w-[200px] mx-auto ml-[80px] lg:mx-0 mb-10 lg:mb-0 lg:w-[300px] object-cover rounded-lg shadow-2xl"
          />

          <div className="flex flex-col col-span-2 justify-between h-full">
            <div>
              <h1 className="text-3xl font-bold mb-4">{selectedBook.title}</h1>

              <p className="text-gray-700 mb-6 text-lg">
                {selectedBook.description}
              </p>

              <p className="text-md text-gray-500 mb-4">
                Category :
                {selectedBook.category
                  ? selectedBook.category[0].toUpperCase() +
                    selectedBook.category.slice(1)
                  : "N/A"}
              </p>

              <div className="text-xl mb-4">
                <span className="font-extrabold text-green-600 mr-4 text-3xl">
                  ₹ {selectedBook.newPrice * quantity}
                </span>
                <del className="text-gray-500 mr-3">
                  ₹ {selectedBook.oldPrice}
                </del>
                <span className="text-md text-green-500 ">
                  {Math.floor(
                    100 -
                      (selectedBook.newPrice / selectedBook.oldPrice) * 100
                  )}{" "}
                  % off
                </span>
              </div>

              <p className="pb-2 text-md lg:mb-5">Quantity:</p>

              <div className="flex">
                <button
                  className="bg-blue-500 text-white px-2 py-1"
                  onClick={quantityDecrease}
                >
                  -
                </button>
                <p className="px-2 py-1">{quantity}</p>
                <button
                  className="bg-blue-500 text-white px-2 py-1"
                  onClick={quantityIncrease}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={addToCart}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mt-10 lg:mt-0 w-[140px]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>

    {open && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
      
      <h2 className="text-xl font-semibold mb-4">Send Feedback</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your feedback..."
        className="w-full h-28 border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={submitFeedback}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

    </div>
  </div>
)}


      {/* Trending Books Section */}

      {/* Banner Image */}
      <img src={banner} className="w-full h-[600px] p-3 rounded-lg" alt="" />

      <h1 className="text-2xl font-bold m-6 ml-12">Trending Books</h1>
      <div className="relative">
        <button
          ref={trendingScrollRef}
          onClick={() => scroll(trendingScrollRef, "left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 ml-3 lg:ml-7"
        >
          <i className="bx bx-chevron-left text-2xl"></i>
        </button>
        <div
          ref={trendingScrollRef}
          className="flex overflow-x-auto Lg:gap-6 gap-8 scrollbar-hide scroll-smooth px-12"
        >
          {trendingProduct.map((trend) => (
            <div
              key={trend.id}
              onClick={() => setSelectedBook(trend)}
              className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform "
            >
              <BookDesign trend={trend} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(trendingScrollRef, "right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 mr-3 lg:mr-7"
        >
          <i className="bx bx-chevron-right text-2xl"></i>
        </button>
      </div>

      {/* Category Section */}
      <h1 className="text-2xl font-bold m-6 mt-10 ml-14">Books By Category</h1>
<div className="relative w-64 ml-10 lg:ml-14 mb-6">
  <select
    value={category}
    onChange={handleSelect}
    className="
      w-full
      appearance-none
      bg-white
      border border-gray-300
      rounded-lg
      px-4 py-2
      text-gray-700
      shadow-sm
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
      hover:border-gray-400
      transition
      cursor-pointer
    "
  >
    <option value="">Select Category</option>
    <option value="fiction">Fiction</option>
    <option value="fantasy">Fantasy</option>
    <option value="business">Business</option>
    <option value="horror">Horror</option>
    <option value="self-help">Self Help</option>
    <option value="science fiction">Science Fiction</option>
    <option value="thriller">Thriller</option>
  </select>

  {/* Dropdown Icon */}
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>


      {categoryBooks.length > 0 && (
        <div className="relative">
          <button
            onClick={() => scroll(categoryScrollRef, "left")}
            className="absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 ml-3 lg:ml-7"
          >
            <i className="bx bx-chevron-left text-2xl"></i>
          </button>
          <div
            ref={categoryScrollRef}
            className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth px-12"
          >
            {categoryBooks.map((trend) => (
              <div
                key={trend.id}
                onClick={() => setSelectedBook(trend)}
                className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <BookDesign trend={trend} />
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll(categoryScrollRef, "right")}
            className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 mr-3 lg:mr-7"
          >
            <i className="bx bx-chevron-right text-2xl"></i>
          </button>
        </div>
      )}

      {/* Trending Books Section */}
      <h1 className="text-2xl font-bold m-6 ml-12">Harry Potter Series</h1>
      <div className="relative">
        <button
          ref={hpRef}
          onClick={() => scroll(hpRef, "left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 ml-3 lg:ml-7"
        >
          <i className="bx bx-chevron-left text-2xl"></i>
        </button>
        <div
          ref={hpRef}
          className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth px-12"
        >
          {harryPotter.map((trend) => (
            <div
              key={trend.id}
              onClick={() => setSelectedBook(trend)}
              className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
            >
              <BookDesign trend={trend} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(hpRef, "right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 mr-3 lg:mr-7"
        >
          <i className="bx bx-chevron-right text-2xl"></i>
        </button>
        <button
  onClick={() => setOpen(true)}
  className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
>
  Feedback
</button>

      </div>
      <Footer />
    </>
  );
}

export default Home;
