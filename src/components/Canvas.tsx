import { useEffect, useState } from "react";
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
    b: 255
};

interface CustomSketchProps extends SketchProps {
    updateCenter: (newCenter: { x: number; y: number }) => void;
}

function sketch(p5: P5CanvasInstance<CustomSketchProps>) {
    const center = { x: 0, y: 0 };

    // only runs once on mount
    p5.setup = () => {
        p5.createCanvas(WIDTH, HEIGHT, p5.WEBGL);
        p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
    };

    // loops continuously
    p5.draw = () => {
        //p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
        p5.noStroke();

        // panning
        p5.translate(center.x, center.y);

        // mouse cursor
        // p5.fill(0, 0, 0);
        // const mouseXOffset = p5.mouseX - WIDTH / 2 - center.x;
        // const mouseYOffset = p5.mouseY - HEIGHT / 2 - center.y;
        // p5.circle(mouseXOffset, mouseYOffset, 10);

        // draw elements in sorted order
        p5.fill(0, 51, 160); // the color of the element
        p5.circle(0, 0, 100); // the position and size of the element

        p5.fill(0, 51, 0);
        p5.circle(-200, -200, 100);

        p5.fill(255, 0, 0);
        p5.circle(200, 200, 100);
    };

    p5.mouseDragged = () => {
        // case: Tool = "Pan"
        // center.x += p5.mouseX - p5.pmouseX; // dX
        // center.y += p5.mouseY - p5.pmouseY; // dY

        // case: Tool = "Brush"
        p5.fill(0, 0, 0);
        const mouseXOffset = p5.mouseX - WIDTH / 2 - center.x;
        const mouseYOffset = p5.mouseY - HEIGHT / 2 - center.y;
        p5.circle(mouseXOffset, mouseYOffset, 10);
    };

    p5.updateWithProps = (props) => {
        props.updateCenter({ x: -center.x, y: -center.y });
    };
}

function Canvas() {
    const [center, setCenter] = useState({ x: 0, y: 0 });
    const [bottomRight, setBottomRight] = useState({ x: WIDTH, y: HEIGHT });

    const updateCenter = (newCenter: { x: number; y: number }) => {
        setCenter(newCenter);
    };

    useEffect(() => {
        setBottomRight({ x: center.x + Math.ceil(WIDTH / 2), y: center.y + Math.ceil(HEIGHT / 2) });
    }, [center]);

    return (
        <>
            <div>
                <p>
                    Center: ({center.x}, {center.y})
                </p>
                <p>
                    Bottom Right: ({bottomRight.x}, {bottomRight.y})
                </p>
                <ReactP5Wrapper sketch={sketch} updateCenter={updateCenter} />
            </div>
        </>
    );
}

export default Canvas;
