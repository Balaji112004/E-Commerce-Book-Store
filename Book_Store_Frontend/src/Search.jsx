import React, { useEffect, useState, useContext } from "react";
import BookDesign from "/src/BookDesign";
import axios from "axios";
import { SearchContext } from "./context/SearchContext";
import { UserContext } from "./context/UserContext";
import Footer from "./Footer";

function Search() {
  const { user } = useContext(UserContext);
  const { search } = useContext(SearchContext);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]); // checked genres

  const [quantity, setQuantity] = useState(1);

  const quantityIncrease = () => setQuantity(quantity + 1);
  const quantityDecrease = () => quantity > 1 && setQuantity(quantity - 1);

  const sortLowToHigh = () => {
    const sorted = [...books].sort((a, b) => a.newPrice - b.newPrice);
    setBooks(sorted);
  };

  const sortHighToLow = () => {
    const sorted = [...books].sort((a, b) => b.newPrice - a.newPrice);
    setBooks(sorted);
  };

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
  const booksearch = async (search) => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/search/books/" + search
      );
      setBooks(res.data);

      console.log("Searched Books");
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching searched books:", err);
    }
  };

  const genres = [...new Set(books.map((book) => book.category))];

  const handleGenreChange = (genre) => {
    setSelectedGenres(
      (prev) =>
        prev.includes(genre)
          ? prev.filter((g) => g !== genre) // uncheck
          : [...prev, genre] // check
    );
  };

  const filteredBooks =
    selectedGenres.length === 0
      ? books
      : books.filter((book) => selectedGenres.includes(book.category));

  useEffect(() => {
    if (search) {
      booksearch(search);
    }
  }, [search]);

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
                    100 - (selectedBook.newPrice / selectedBook.oldPrice) * 100
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
    <div>
      <div className="grid grid-cols-4 gap-4 h-screen">
        <div className="">
          <div className=" gap-4 bg-white shadow p-4 rounded-lg ">
            <h1 className="text-lg font-semibold mb-7">Sort by Price:</h1>

            <div className="flex flex-col gap-4 w-[70%]">
              <button
                onClick={sortLowToHigh}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Low <span className="mx-2">→</span> High
              </button>

              <button
                onClick={sortHighToLow}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                High <span className="mx-2">→</span> Low
              </button>
            </div>
          </div>
          <h2 className="text-lg font-semibold m-3 mb-4 ">Genres</h2>

          <div className="space-y-3 ml-7">
            {genres.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-3 cursor-pointer text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="
            w-4 h-4
            text-blue-600
            border-gray-300
            rounded
            focus:ring-blue-500
          "
                />
                <span className="capitalize">{genre}</span>
              </label>
            ))}
          </div>
        </div>
        <div className=" col-span-3">
          <div>
            <h1 className="font-bold text-xl m-3">
              Search results for :{" "}
              <span className="text-blue-500">{search}</span>
            </h1>
            <div className="grid grid-cols-4 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform "
                >
                  <BookDesign trend={book} />
                </div>
              ))}
            </div>
            {/* <Footer/> */}
          </div>
          
        </div>
        
      </div>
      
      
    </div>
    
  );
}

export default Search;
