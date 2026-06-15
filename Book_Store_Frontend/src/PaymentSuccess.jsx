// import { useEffect, useContext } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { UserContext } from "./context/UserContext";

// function PaymentSuccess() {
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("orderId");
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         console.log(" Verifying payment for order:", orderId);

//         const res = await axios.post(
//           `http://localhost:8080/api/orders/verify/${orderId}`,
//           {
//             payment_id: "test_payment_id_123",
//             signature: "test_signature_123",
//           }
//         );

//         console.log(" Verification response:", res.data);

//         if (res.data.success) {
//           alert(" Payment successful! Order confirmed.");
//           navigate("/orders");
//         } else {
//           console.error(" Payment verification failed!", res.data.message);
//           navigate("/cart");
//         }
//       } catch (err) {
//         //  Removed the second alert here
//         console.error(" Payment verification error:", err);
//         // Just redirect silently without showing alert
//         navigate("/cart");
//       }
//     };

//     if (orderId && user?.id) {
//       verifyPayment();
//     }
//   }, [orderId, user, navigate]);

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <p className="text-xl font-semibold text-gray-700">
//         Verifying your payment, please wait...
//       </p>
//     </div>
//   );
// }

// export default PaymentSuccess;
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./context/UserContext";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"
  const [message, setMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      setStatus("failed");
      setMessage("Invalid payment session. Order ID is missing.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          `http://localhost:8080/api/orders/verify/${orderId}`,
          {} // body not required, backend fetches from Cashfree directly
        );

        if (res.data.success) {
          setStatus("success");
          setMessage(res.data.message || "Payment verified successfully!");
          setOrderDetails({
            orderId: res.data.orderId,
            amount: res.data.amount,
            paymentMethod: res.data.paymentMethod,
          });
        } else {
          setStatus("failed");
          setMessage(res.data.message || "Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        const errMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong during verification.";
        setStatus("failed");
        setMessage(errMsg);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">

        {/* Verifying State */}
        {status === "verifying" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Verifying your payment...</h2>
            <p className="text-gray-400 mt-2 text-sm">Please do not close this window.</p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 text-sm mb-4">{message}</p>

            {orderDetails && (
              <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Order ID</span>
                  <span>#{orderDetails.orderId}</span>
                </div>
                {orderDetails.amount && (
                  <div className="flex justify-between">
                    <span className="font-medium">Amount Paid</span>
                    <span className="text-green-600 font-semibold">₹{orderDetails.amount}</span>
                  </div>
                )}
                {orderDetails.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Method</span>
                    <span>{orderDetails.paymentMethod}</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
            >
              Continue Shopping
            </button>
          </>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/cart")}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
              >
                Back to Cart
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition"
              >
                Home
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default PaymentSuccess;
