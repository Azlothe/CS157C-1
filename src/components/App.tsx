import { BrowserRouter, Routes, Route } from "react-router-dom";
import CanvasPage from "../pages/CanvasPage";

// import "./App.css";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" />
                    <Route path="/canvas" element={<CanvasPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
