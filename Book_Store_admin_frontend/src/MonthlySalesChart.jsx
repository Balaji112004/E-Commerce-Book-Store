import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function MonthlySalesChart() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(2025);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  async function loadData() {
    let result = [];

    for (let month = 1; month <= 12; month++) {
      const res = await axios.get(
        `http://localhost:8080/admin/monthwise/salary/${month}/${year}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
      );
      result.push(res.data || 0);
    }

    setData(result);
  }

  useEffect(() => {
    loadData();
  }, [year]);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Revenue ₹",
        data: data,
        backgroundColor: "rgba(0, 130, 255, 0.6)",
        hoverBackgroundColor: "rgba(0, 130, 255, 0.9)",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="flex justify-center my-8">
      <div className="bg-white shadow-2xl rounded-2xl w-full md:w-[1400px] p-6">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Monthly Sales Report
          </h2>

        <div className="flex ">
                        <h1 className="mr-4 mt-1">Year:</h1>
          <select
            className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-1"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option>2025</option>
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
          </select>
        </div>
        </div>

        {/* <hr className="my-4"></hr> */}

        <div className="w-full h-[350px]">
          <Bar 
            data={chartData}
            options={{
              maintainAspectRatio: false,
              animation: { duration: 800 },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MonthlySalesChart;
