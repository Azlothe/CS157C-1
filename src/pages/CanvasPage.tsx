import { useEffect, useState } from "react";
import Canvas from "../components/Canvas.tsx";
import VerticalToolbar from "../components/VerticalToolbar.tsx";

type Tool = "Pan" | "Brush" | "Eraser";

function CanvasPage() {
    const [tool, setTool] = useState("Brush");
    const [size, setSize] = useState(0);
    const [color, setColor] = useState({ r: 0, g: 0, b: 0 });

    const updateTool = (s: Tool) => {
        setTool(s);
    };

    const updateColor = (color: { r: number; g: number; b: number }) => {
        setColor(color);
    };

    useEffect(() => {
        console.log("switch to " + tool + " tool");
    }, [tool]);

    return (
        <>
            <div className="bg-gray-500 flex justify-center items-center w-screen h-screen">
                <VerticalToolbar
                    updateTool={updateTool}
                    updateColor={updateColor}
                    color={color}
                />
                <Canvas tool={tool} color={color} />
            </div>
        </>
    );
}

export default CanvasPage;
