import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./services/FirebaseService";
import { onAuthStateChanged } from "firebase/auth";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CanvasPage from "./pages/CanvasPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {!isAuthenticated ? (
                        <Route path="/" element={<HomePage />} />
                    ) : (
                        <Route
                            path="/"
                            element={<Navigate to="/canvas" />}
                        />
                    )}
                    {!isAuthenticated ? (
                        <Route path="/login" element={<LoginPage />} />
                    ) : (
                        <Route
                            path="/login"
                            element={<Navigate to="/canvas" />}
                        />
                    )}
                    {!isAuthenticated ? (
                        <Route path="/signup" element={<SignupPage />} />
                    ) : (
                        <Route
                            path="/signup"
                            element={<Navigate to="/canvas" />}
                        />
                    )}
                    <Route path="/canvas" element={<CanvasPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
