import { useEffect, useState } from "react";
import Canvas from "../components/Canvas.tsx";
import VerticalToolbar from "../components/VerticalToolbar.tsx";

function CanvasPage() {
    const [tool, setTool] = useState("Brush");
    // const [brushSize, setBrushSize] = useState(0);
    // const [brushColor, setBrushColor] = useState({r: 0, g: 0, b: 0});

    const updateTool = (s: string) => {
        setTool(s);
    };

    useEffect(() => {
        console.log("switch to " + tool + " tool");
    }, [tool]);

    return (
        <>
            <div className="bg-gray-500 flex justify-center items-center w-screen h-screen">
                <VerticalToolbar updateTool={updateTool}/>
                <Canvas tool={tool}/>
            </div>
        </>
    );
}

export default CanvasPage;
