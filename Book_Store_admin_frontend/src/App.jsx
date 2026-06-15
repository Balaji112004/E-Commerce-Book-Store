import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./Nav";
import Dashboard from "./Dashboard";
import Books from "./Books";
import Orders from "./Orders";
import User from "./User";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route → Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Layout → Nav + pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Nav />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="order" element={<Orders />} />
          <Route path="user" element={<User />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
