import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/admin/users/details",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading users...</p>;
  if (!users || users.length === 0)
    return <p className="text-center mt-10">No users found.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow rounded-lg overflow-x-auto w-full">
        <h1 className="text-2xl font-bold mb-4 px-6 py-4 border-b">
          User Details
        </h1>

        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50 ">
            <tr className="">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border">
                Address
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 ">
                <td className="px-6 py-4 border" >{user.id}</td>
                <td className="px-6 py-4 border">{user.name}</td>
                <td className="px-6 py-4 border">{user.mobile}</td>
                <td className="px-6 py-4 border">{user.email}</td>
                <td className="px-6 py-4 border">{user.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
