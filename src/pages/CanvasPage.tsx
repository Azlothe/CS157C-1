import { useEffect, useState } from "react";
import Canvas from "../components/Canvas.tsx";
import VerticalToolbar from "../components/VerticalToolbar.tsx";
import { Tool, RGB } from "../types/shared.tsx";
import HorizontalToolbar from "../components/HorizontalToolbar.tsx";
import { getEmail } from "../context/AuthContext.ts";

const DEFAULT_TOOL: Tool = "Brush";
const DEFAULT_COLOR: RGB = { r: 0, g: 0, b: 0 };
const DEFAULT_SIZE = 1;

function CanvasPage() {
    const [center, setCenter] = useState({ x: 0, y: 0 });
    const [tool, setTool] = useState<Tool>(DEFAULT_TOOL);
    const [color, setColor] = useState<RGB>(DEFAULT_COLOR);
    const [size, setSize] = useState(DEFAULT_SIZE);

    const updateCenter = (newCenter: { x: number; y: number }) => {
        setCenter(newCenter);
    };

    const updateTool = (tool: Tool) => {
        setTool(tool);
    };

    const updateColor = (color: RGB) => {
        setColor(color);
    };

    const updateSize = (size: number) => {
        setSize(size);
    };

    useEffect(() => {
        (async () => {
            try {
                const email: string = await getEmail() as string;
                console.log("Authenticated as:", email || "Guest");
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        console.log("switch to " + tool + " tool");
    }, [tool]);

    return (
        <>
            <div className="bg-gray-500 flex justify-center items-center w-screen h-screen">
                <HorizontalToolbar center={center}/>
                <VerticalToolbar
                    updateTool={updateTool}
                    updateColor={updateColor}
                    updateSize={updateSize}
                    color={color}
                    size={size}
                />
                <Canvas
                    tool={tool}
                    color={color}
                    size={size}
                    center={center}
                    updateCenter={updateCenter}
                />
            </div>
        </>
    );
}

export default CanvasPage;
