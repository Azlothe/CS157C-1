import { BrowserRouter, Routes, Route } from "react-router-dom";
import CanvasPage from "./pages/CanvasPage";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";

function App() {
  // // console.log(test.testingFunc().then(result => console.log(result)));
  // useEffect(() => {
  //     testingFunc();
  // }, []);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    console.log(`${import.meta.env.VITE_SERVER}/api/emp`);
    fetch(`${import.meta.env.VITE_SERVER}/api/emp`)
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/canvas" element={<CanvasPage />} />
        </Routes>
      </BrowserRouter>
      <div>
        <h1>Vehicles</h1>
        <ul>
          {employees.map((emp) => (
            <li key={emp.emp_id}>{emp.emp_name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
