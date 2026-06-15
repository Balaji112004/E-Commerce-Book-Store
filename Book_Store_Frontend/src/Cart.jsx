// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { UserContext } from "./context/UserContext";
// import { useNavigate } from "react-router-dom";

// function Cart() {
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [placingOrder, setPlacingOrder] = useState(false);

//   // ---------------- Fetch Cart Items ----------------
//   const fetchCartData = async (userId) => {
//     try {
//       const res = await axios.get(`http://localhost:8080/api/cart/${userId}`);
//       setCartItems(res.data);
//     } catch (err) {
//       console.error("Error fetching cart items:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCartItem = async (productId) => {
//     try {
//       await axios.delete(`http://localhost:8080/api/cartDeleteByProduct/${productId}`);
//       fetchCartData(user.id);
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   useEffect(() => {
//     if (user && user.id) fetchCartData(user.id);
//   }, [user]);

//   const totalAmount = cartItems.reduce(
//     (sum, item) => sum + item.newPrice * item.quantity,
//     0
//   );

//   // ---------------- Payment Handler ----------------
//   const handlePayment = async () => {
//     if (!user || !user.id) {
//       alert("Please login to place an order");
//       return;
//     }

//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     setPlacingOrder(true);

//     try {
//       //   Place order in your DB first
//       const orderRes = await axios.post(
//         `http://localhost:8080/api/orders/place/${user.id}`
//       );
//       const order = orderRes.data;

//       // Create Cashfree payment session for that order
//       const paymentPayload = {
//         orderAmount: totalAmount.toFixed(2),
//         customerEmail: user.email || "customer@example.com",
//         customerPhone: user.mobile || "0000000000",
//         customerName: user.name || "Guest User",
//       };

//       const cfRes = await axios.post(
//         `http://localhost:8080/api/orders/payment/${user.id}/${order.id}`,
//         paymentPayload
//       );

//       console.log("Cashfree session response:", cfRes.data);

//       const paymentSessionId =
//         cfRes.data.paymentSessionId || cfRes.data.payment_session_id;
//       const orderId = cfRes.data.orderId || cfRes.data.order_id;

//       if (!paymentSessionId) {
//         alert("Failed to create payment session. Check console for details.");
//         console.error("Invalid Cashfree response:", cfRes.data);
//         return;
//       }

//       //  Launch Cashfree Checkout
//       const cashfree = new window.Cashfree({ mode: "sandbox" });
//       cashfree.checkout({
//         paymentSessionId: paymentSessionId,
//         redirectTarget: "_top",
//         redirectUrl: `http://localhost:5173/payment-success?orderId=${encodeURIComponent(
//           orderId
//         )}`,
//       });
//     } catch (err) {
//       console.error("Error during payment:", err);
//       alert(err.response?.data?.error || "Error initiating payment.");
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   // ---------------- Render UI ----------------
//   if (loading)
//     return <p className="text-center mt-10">Loading cart...</p>;
//   if (cartItems.length === 0)
//     return <p className="text-center mt-10">Your cart is empty.</p>;

//   return (
//     <div className="mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
//       <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

//       {cartItems.map((item) => (
//         <div
//           key={item.productId}
//           className="flex justify-between items-center border-b py-4"
//         >
//           <div className="flex items-center gap-4">
//             <img
//               src={item.coverImage}
//               alt={item.title}
//               className="w-20 h-28 object-cover rounded"
//             />
//             <div>
//               <h2 className="text-lg font-semibold">{item.title}</h2>
//               <p className="text-gray-600">₹{item.newPrice}</p>
//               <p className="text-gray-500">Qty: {item.quantity}</p>
//             </div>
//           </div>

//           <div className="flex flex-col items-end">
//             <p className="font-bold text-green-700 text-lg">
//               ₹{item.newPrice * item.quantity}
//             </p>
//             <div onClick={() => deleteCartItem(item.productId)}>
//               <i className="bx bx-trash text-red-500 text-3xl hover:bg-gray-100 p-2"></i>
//             </div>
//           </div>
//         </div>
//       ))}

//       <div className="flex justify-between items-center mt-6 border-t pt-4">
//         <p className="text-xl font-bold">Total:</p>
//         <p className="text-xl font-bold text-green-700">₹{totalAmount}</p>
//       </div>

//       <div className="flex justify-end mt-6">
//         <button
//           onClick={handlePayment}
//           disabled={placingOrder}
//           className={`px-6 py-2 rounded-lg text-white ${
//             placingOrder ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
//           }`}
//         >
//           {placingOrder ? "Processing..." : "Pay Now"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Cart;
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [deletingId, setDeletingId]   = useState(null); // tracks which item is being deleted

  // ---------------- Fetch Cart Items ----------------
  const fetchCartData = async (userId) => {
    setFetchError(false);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) fetchCartData(user.id);
  }, [user]);

  // ---------------- Delete Cart Item ----------------
  // Scoped to userId + productId so it never affects other users
  const deleteCartItem = async (productId) => {
    if (deletingId) return; // prevent spam clicks
    setDeletingId(productId);
    try {
      await axios.delete(
        `http://localhost:8080/api/cart/${user.id}/product/${productId}`
      );
      // Optimistic UI: remove locally instead of re-fetching
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to remove item. Please try again.");
      fetchCartData(user.id); // re-sync if delete failed
    } finally {
      setDeletingId(null);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.newPrice * item.quantity,
    0
  );

  // ---------------- Payment Handler ----------------
  const handlePayment = async () => {
    if (!user || !user.id) {
      alert("Please login to place an order");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setPlacingOrder(true);
    try {
      // Step 1: Place order in DB
      const orderRes = await axios.post(
        `http://localhost:8080/api/orders/place/${user.id}`
      );
      const order = orderRes.data;

      // Step 2: Create Cashfree payment session
      const paymentPayload = {
        orderAmount:   totalAmount.toFixed(2),
        customerEmail: user.email  || "customer@example.com",
        customerPhone: user.mobile || "9999999999",
        customerName:  user.name   || "Guest User",
      };

      const cfRes = await axios.post(
        `http://localhost:8080/api/orders/payment/${user.id}/${order.id}`,
        paymentPayload
      );

      const paymentSessionId =
        cfRes.data.paymentSessionId || cfRes.data.payment_session_id;
      const orderId =
        cfRes.data.orderId || cfRes.data.order_id;

      if (!paymentSessionId) {
        alert("Failed to create payment session. Please try again.");
        console.error("Invalid Cashfree response:", cfRes.data);
        return;
      }

      // Step 3: Launch Cashfree Checkout
      const cashfree = new window.Cashfree({ mode: "sandbox" });
      cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget:   "_top",
        redirectUrl: `http://localhost:5173/payment-success?orderId=${encodeURIComponent(orderId)}`,
      });
    } catch (err) {
      console.error("Error during payment:", err);
      alert(err.response?.data?.error || "Error initiating payment. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ---------------- Render States ----------------
  if (loading)
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (fetchError)
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 text-lg mb-4">Failed to load cart. Please try again.</p>
        <button
          onClick={() => fetchCartData(user.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Browse Books
        </button>
      </div>
    );

  // ---------------- Main UI ----------------
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.map((item) => (
        <div
          key={item.productId}
          className="flex justify-between items-center border-b py-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.coverImage}
              alt={item.title}
              className="w-20 h-28 object-cover rounded"
            />
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-600">₹{item.newPrice.toFixed(2)}</p>
              <p className="text-gray-500">Qty: {item.quantity}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <p className="font-bold text-green-700 text-lg">
              ₹{(item.newPrice * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => deleteCartItem(item.productId)}
              disabled={deletingId === item.productId}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Remove item"
            >
              {deletingId === item.productId ? (
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <i className="bx bx-trash text-red-500 text-2xl"></i>
              )}
            </button>
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <p className="text-xl font-bold">Total:</p>
        <p className="text-xl font-bold text-green-700">₹{totalAmount.toFixed(2)}</p>
      </div>

      {/* Pay Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handlePayment}
          disabled={placingOrder}
          className={`px-6 py-2.5 rounded-lg text-white font-medium transition ${
            placingOrder
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {placingOrder ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </div>
  );
}

export default Cart;