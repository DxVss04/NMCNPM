import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Statistics from "./pages/Statistics/Statistics.jsx";
import Residents from "./pages/Residents/Residents.jsx";
import ResidentForm from "./pages/ResidentForm/ResidentForm.jsx";
import Meters from "./pages/Meters/Meters.jsx";
import Posts from "./pages/Posts/Posts.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";

// Bills
import Bills from "./pages/Bills/Bills.jsx";
import BillForm from "./pages/Bills/BillForm.jsx";
import OverdueList from "./pages/Bills/OverdueList.jsx";

function App() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/statistics" />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/residents/add" element={<ResidentForm />} />
          <Route path="/residents/edit/:id" element={<ResidentForm />} />
          <Route path="/meters" element={<Meters />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/bills/add" element={<BillForm />} />
          <Route path="/bills/edit/:id" element={<BillForm />} />
          <Route path="/bills/overdue" element={<OverdueList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
