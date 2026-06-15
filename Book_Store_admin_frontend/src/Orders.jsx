import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await axios.get("http://localhost:8080/admin/order/details",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
    setOrders(res.data);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.orderId} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between gap-4 border-b pb-4">
              <div>
                <p className="mb-2">
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order.orderId}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">User:</span> <span className="font-semibold ml-1">{order.userName}</span>
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 text-sm rounded ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>

              <div>
                <p className="mr-9">
                  <span className="font-semibold ">Date:</span>{" "}
                  {order.orderDate.slice(0, 10)}
                </p>
                <p className="mr-9 mt-3">
                  <span className="font-semibold ">Total:</span> ₹
                  {order.totalAmount}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
                >
                  {/* Product Image */}
                  <img
                    src={item.product.coverImage}
                    alt={item.product.title}
                    className="w-16 h-20 object-cover rounded-md flex-shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                    {/* Title */}
                    <p className="font-semibold text-gray-800">
                      {item.product.title}
                    </p>

                    {/* Quantity and Price */}
                    <div className=" text-gray-600 text-right flex justify-end md:text-left">
                      <p>
                        Qty:{" "}
                        <span className="font-medium mr-10">
                          {item.quantity}
                        </span>
                      </p>
                      <p>
                        Price:{" "}
                        <span className="font-medium mr-9">₹{item.price}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
