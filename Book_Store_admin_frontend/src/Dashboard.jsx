import React, { useEffect, useState } from "react";
import axios from "axios";
import MonthlySalesChart from "./MonthlySalesChart";
function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/admin/dashboard/details",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(res.data);
        setDashboardData(res.data);
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      {/* <h1 className="text-xl font-bold ">Dashboard</h1> */}
      <div className="grid grid-cols-4">
        <div className=" bg-white shadow-lg rounded-lg p-4 m-4 ">
          <div className="text-lg mb-3 ">Total Books</div>
          <div className="text-2xl">{dashboardData.Books}</div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 m-4 ">
          <div className="text-lg mb-3">Users</div>
          <div className="text-2xl">{dashboardData.Users}</div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 m-4 ">
          <div className="text-lg mb-3">Orders</div>
          <div className="text-2xl">{dashboardData.Orders}</div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 m-4 ">
          <div className="text-lg mb-3">Total Revenue</div>
          <div className="text-2xl">₹ {dashboardData.Amount}</div>
        </div>
      </div>

      <div className="flex justify-center">
        {/* show your monthly graph */}
        <MonthlySalesChart />
      </div>

      <div></div>
    </div>
  );
}

export default Dashboard;
