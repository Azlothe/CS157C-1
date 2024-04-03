import { useState } from "react";
import {
    P5CanvasInstance,
    ReactP5Wrapper,
    SketchProps,
} from "@p5-wrapper/react";

const WIDTH = 800;
const HEIGHT = 450;
const BG_COLOR = {
    r: 255,
    g: 255,
    b: 255,
};

interface CustomSketchProps extends SketchProps {
    pcenter: { x: number; y: number };
    updateCenter: (newCenter: { x: number; y: number }) => void;
    isMouseMove: boolean;
}

function sketch(p5: P5CanvasInstance<CustomSketchProps>) {
    const center = { x: 0, y: 0 };
    let isP5Init = false;
    let isPan = false;
    let isDraw = true;

    // only runs once on mount
    p5.setup = () => {
        p5.createCanvas(WIDTH, HEIGHT, p5.WEBGL);
        p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
        p5.frameRate(60);
        isP5Init = true;
    };

    // loops continuously
    p5.draw = () => {
        if (isPan) {
            p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
        }

        // panning
        p5.translate(center.x, center.y);

        p5.noStroke();

        // draw elements in sorted order
        p5.fill(0, 51, 160); // the color of the element
        p5.circle(0, 0, 100); // the position and size of the element

        p5.fill(0, 51, 0);
        p5.circle(-150, -150, 100);

        p5.fill(255, 0, 0);
        p5.circle(150, 150, 100);
    };

    p5.mouseDragged = () => {
        // Tool = "Pan"
        if (isP5Init && isPan) {
            center.x += p5.mouseX - p5.pmouseX; // dX
            center.y += p5.mouseY - p5.pmouseY; // dY
        }

        // Tool = "Brush"
        if (isP5Init && isDraw) {
            p5.stroke(0, 0, 0);
            p5.strokeWeight(10);
            const pmouseXOffset = p5.pmouseX - WIDTH / 2 - center.x;
            const pmouseYOffset = p5.pmouseY - HEIGHT / 2 - center.y;
            const mouseXOffset = p5.mouseX - WIDTH / 2 - center.x;
            const mouseYOffset = p5.mouseY - HEIGHT / 2 - center.y;
            p5.line(pmouseXOffset, pmouseYOffset, mouseXOffset, mouseYOffset);
        }
    };

    p5.keyPressed = () => {
        if (p5.key == " ") {
            isPan = true;
            isDraw = false;
        }
    };

    p5.keyReleased = () => {
        if (p5.key == " ") {
            isPan = false;
            isDraw = true;
        }
    };

    p5.updateWithProps = (props) => {
        // to fix negative zeros 
        const newX = center.x === 0 ? 0 : -center.x;
        const newY = center.y === 0 ? 0 : -center.y;
        
        if (isPan && props.isMouseMove) {
            console.log("update center state"); 
            if (newX !== props.pcenter.x && newY !== props.pcenter.y) {
                props.updateCenter({ x: newX, y: newY });
            }
        }
    };
}

function Canvas() {
    const [center, setCenter] = useState({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isMouseMove, setIsMouseMove] = useState(false);

    const bottomRight = {
        x: center.x + Math.ceil(WIDTH / 2),
        y: center.y + Math.ceil(HEIGHT / 2),
    };

    const updateCenter = (newCenter: { x: number; y: number }) => {
        setCenter(newCenter);
    };

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
            <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}> 
                <p>
                    Center: ({center.x}, {center.y}) 
                </p>
                <p>
                    Bottom Right: ({bottomRight.x}, {bottomRight.y})
                </p>
                <ReactP5Wrapper
                    sketch={sketch}
                    pcenter={center}
                    updateCenter={updateCenter}
                    isMouseMove={isMouseMove}
                />
            </div>
        </>
    );
}

export default Canvas;
