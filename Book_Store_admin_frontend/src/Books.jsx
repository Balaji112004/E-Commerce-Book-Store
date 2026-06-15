import React, { useEffect, useState } from "react";
import axios from "axios";

function Books() {
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [newBook, setNewBook] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:8080/admin/fullBooks",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure to delete this book?")) return;

    axios
      .delete(`http://localhost:8080/admin/product/${id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })

      .then(() => fetchBooks());
  };

  const handleEditClick = (book) => {
    setEditingBookId(book.id);
    setFormData({ ...book });
  };

  const handleAddClick = () => {
    setNewBook({
      title: "",
      description: "",
      oldPrice: "",
      newPrice: "",
      category: "",
      coverImage: "",
      trending: false,
    });
    setFormData({
      title: "",
      description: "",
      oldPrice: "",
      newPrice: "",
      category: "",
      coverImage: "",
      trending: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdateSubmit = () => {
    axios
      .put(`http://localhost:8080/admin/product/${editingBookId}`, formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })

      .then(() => {
        fetchBooks();
        setEditingBookId(null);
      });
  };

  const handleAddSubmit = () => {
    axios
      .post("http://localhost:8080/admin/product", formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })

      .then(() => {
        fetchBooks();
        setNewBook(null);
      });
  };

  const handleCancel = () => {
    setEditingBookId(null);
    setNewBook(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Management – Books</h1>
        {!newBook && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleAddClick}
          >
            + Add Book
          </button>
        )}
      </div>

      {/* Add New Book Form */}
      {newBook && (
        <div className="fixed inset-0 backdrop-blur-md bg-transparent flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded shadow-lg w-[600px] animate-scaleIn rounded-2xl">
            <h2 className="font-bold mb-4">Add New Book</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="border p-2 rounded col-span-2"
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="border p-2 rounded col-span-2"
              />

              <input
                type="number"
                name="oldPrice"
                placeholder="Old Price"
                value={formData.oldPrice}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />

              <input
                type="number"
                name="newPrice"
                placeholder="New Price"
                value={formData.newPrice}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="coverImage"
                placeholder="Cover Image URL"
                value={formData.coverImage}
                onChange={handleInputChange}
                className="border p-2 rounded col-span-2"
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="trending"
                  className="w-[15px] h-[15px]"
                  checked={formData.trending}
                  onChange={handleInputChange}
                />
                <span>Trending</span>
              </label>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleAddSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Books Table */}
      <table className="w-full border rounded-xl shadow-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 border">Cover</th>
            <th className="p-3 border">Title</th>
            <th className="p-3 border">Description</th>
            <th className="p-3 border">Old Price</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Trending</th>
            <th className="p-3 border">Edit</th>
            <th className="p-3 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              {editingBookId === b.id ? (
                <div className="fixed inset-0 backdrop-blur-md bg-transparent flex justify-center items-center z-50 animate-fadeIn">
                  <div className="bg-white p-6 rounded shadow-lg w-[600px] animate-scaleIn rounded-2xl">
                    <h2 className="font-bold mb-4">Edit Book</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="border p-2 rounded col-span-2"
                      />

                      <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border p-2 rounded col-span-2"
                      />

                      <input
                        type="number"
                        name="oldPrice"
                        placeholder="Old Price"
                        value={formData.oldPrice}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                      />

                      <input
                        type="number"
                        name="newPrice"
                        placeholder="New Price"
                        value={formData.newPrice}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        name="coverImage"
                        placeholder="Cover Image URL"
                        value={formData.coverImage}
                        onChange={handleInputChange}
                        className="border p-2 rounded col-span-2"
                      />

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="trending"
                          checked={formData.trending}
                          onChange={handleInputChange}
                          className="w-[15px] h-[15px]"
                        />
                        <span>Trending</span>
                      </label>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        className="px-4 py-2 bg-gray-400 text-white rounded"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={handleUpdateSubmit}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <td className="border p-2 text-center">
                    {b.coverImage ? (
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-16 h-20 object-cover mx-auto rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border p-2">{b.title}</td>
                  <td className="border p-2">{b.description}</td>
                  <td className="border p-2 line-through text-gray-500">
                    ₹ {b.oldPrice}
                  </td>
                  <td className="border p-2 font-semibold">₹ {b.newPrice}</td>
                  <td className="border p-2">{b.category}</td>
                  <td className="border p-2 text-center">
                    {b.trending ? "Yes" : "No"}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      className="p-2 bg-green-500 text-white rounded"
                      onClick={() => handleEditClick(b)}
                    >
                      <i className="bx bx-edit text-xl">
                        {/* <span className="poppins"> Edit</span> */}
                      </i>
                    </button>
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      className="p-2 bg-red-600 text-white rounded"
                      onClick={() => handleDelete(b.id)}
                    >
                      <i className="bx bx-trash-alt text-lg ">
                        {/* <span className="poppins"> Delete</span> */}
                      </i>
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
