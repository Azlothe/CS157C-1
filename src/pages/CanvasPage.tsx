import { useEffect, useState } from "react";
import Canvas from "../components/Canvas.tsx";
import VerticalToolbar from "../components/VerticalToolbar.tsx";
import {Tool, RGB} from "../types/shared.tsx";

function CanvasPage() {
    const [tool, setTool] = useState<Tool>("Brush");
    // const [size, setSize] = useState(0);
    const [color, setColor] = useState<RGB>({ r: 0, g: 0, b: 0 });

    const updateTool = (tool: Tool) => {
        setTool(tool);
    };

    const updateColor = (color: RGB) => {
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
