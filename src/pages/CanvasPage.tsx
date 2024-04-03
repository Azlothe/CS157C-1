import { useState } from "react";
import Canvas from "../components/Canvas.tsx";

function CanvasPage() {
    const [tool, setTool] = useState("Brush");
    const [brushSize, setBrushSize] = useState(0);
    const [brushColor, setBrushColor] = useState({r: 0, g: 0, b: 0});

    return (
        <>
            <div className="bg-gray-500 flex justify-center items-center w-screen h-screen">
                <Canvas />
            </div>
        </>
    );
}

export default CanvasPage;
