import { useState } from "react";
import {
    P5CanvasInstance,
    ReactP5Wrapper,
    SketchProps,
} from "@p5-wrapper/react";
import { Tool, RGB } from "../types/shared.tsx";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const BG_COLOR: RGB = {
    r: 255,
    g: 255,
    b: 255,
};
const DEFAULT_CENTER = { x: 0, y: 0 };
const DEFAULT_TOOL = "Brush";
const DEFAULT_COLOR = { r: 0, g: 0, b: 0 };
const DEFAULT_SIZE = 1;

interface Props {
    tool: Tool;
    color: RGB;
    size: number;
    center: {x: number, y: number};
    updateCenter: (center: {x: number, y: number}) => void;
}

function Canvas({ tool, color, size, center, updateCenter }: Props) {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isMouseMove, setIsMouseMove] = useState(false);

    // const bottomRight = {
    //     x: center.x + Math.ceil(WIDTH / 2),
    //     y: center.y + Math.ceil(HEIGHT / 2),
    // };

    const handleMouseDown = () => {
        setIsMouseDown(true);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseMove = () => {
        if (isMouseDown) {
            setIsMouseMove(!isMouseMove);
        }
    };

    return (
        <>
            <div
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {/* <p>
                    Center: ({center.x}, {center.y}) 
                </p>
                <p>
                    Bottom Right: ({bottomRight.x}, {bottomRight.y})
                </p> */}
                <ReactP5Wrapper
                    sketch={sketch}
                    pcenter={center}
                    updateCenter={updateCenter}
                    isMouseMove={isMouseMove}
                    tool={tool}
                    color={color}
                    size={size}
                />
            </div>
        </>
    );
}

interface CustomSketchProps extends SketchProps {
    pcenter: { x: number; y: number };
    updateCenter: (newCenter: { x: number; y: number }) => void;
    isMouseMove: boolean;
    tool: Tool;
    color: RGB;
    size: number;
}

function sketch(p5: P5CanvasInstance<CustomSketchProps>) {
    let isP5Init = false;
    const center = DEFAULT_CENTER;
    let tool = DEFAULT_TOOL;
    let color = DEFAULT_COLOR;
    let size = DEFAULT_SIZE;

    // only runs once on mount
    p5.setup = () => {
        p5.createCanvas(WIDTH, HEIGHT, p5.WEBGL);
        p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
        p5.frameRate(120);
        isP5Init = true;
    };

    // loops continuously
    p5.draw = () => {
        if (tool === "Pan") {
            p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
        }

        // panning
        p5.translate(center.x, center.y);

        p5.noStroke();

        // draw elements in sorted order

        // circle for testing panning
        p5.fill(0, 51, 160);
        p5.circle(0, 0, 100);
    };

    p5.mouseDragged = () => {
        // Tool = "Pan"
        if (isP5Init && tool === "Pan") {
            center.x += p5.mouseX - p5.pmouseX; // dX
            center.y += p5.mouseY - p5.pmouseY; // dY
        }

        // Tool = "Brush"
        if (isP5Init && tool === "Brush") {
            p5.stroke(color.r, color.g, color.b);
            p5.strokeWeight(size);
            const pmouseXOffset = p5.pmouseX - WIDTH / 2 - center.x;
            const pmouseYOffset = p5.pmouseY - HEIGHT / 2 - center.y;
            const mouseXOffset = p5.mouseX - WIDTH / 2 - center.x;
            const mouseYOffset = p5.mouseY - HEIGHT / 2 - center.y;
            p5.line(pmouseXOffset, pmouseYOffset, mouseXOffset, mouseYOffset);
        }

        // Tool = "Eraser"
        if (isP5Init && tool === "Eraser") {
            p5.stroke(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
            p5.strokeWeight(size);
            const pmouseXOffset = p5.pmouseX - WIDTH / 2 - center.x;
            const pmouseYOffset = p5.pmouseY - HEIGHT / 2 - center.y;
            const mouseXOffset = p5.mouseX - WIDTH / 2 - center.x;
            const mouseYOffset = p5.mouseY - HEIGHT / 2 - center.y;
            p5.line(pmouseXOffset, pmouseYOffset, mouseXOffset, mouseYOffset);
        }
    };

    // p5.keyPressed = () => {
    //     if (p5.key == " ") {
    //         isPan = true;
    //     }
    // };

    // p5.keyReleased = () => {
    //     if (p5.key == " ") {
    //         isPan = false;
    //     }
    // };

    p5.updateWithProps = (props) => {
        // to fix negative zeros
        const newX = center.x === 0 ? 0 : -center.x;
        const newY = center.y === 0 ? 0 : -center.y;

        if (tool === "Pan" && props.isMouseMove) {
            console.log("update center to {" + newX + ", " + newY + "}");
            if (newX !== props.pcenter.x && newY !== props.pcenter.y) {
                props.updateCenter({ x: newX, y: newY });
            }
        }

        tool = props.tool;
        color = props.color;
        size = props.size;
    };
}

export default Canvas;
