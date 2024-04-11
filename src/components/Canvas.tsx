import { useState } from "react";
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from "@p5-wrapper/react";
import { Tool, RGB } from "../types/shared.tsx";
import { loadStrokes } from "../services/CanvasService.ts";
import { useEffect } from "react";


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
  center: { x: number; y: number };
  updateCenter: (center: { x: number; y: number }) => void;
}

function Canvas({ tool, color, size, center, updateCenter }: Props) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseMove, setIsMouseMove] = useState(false);
  const [strokePath, setStrokePath] = useState<{ x: number; y: number }[]>([]);

  const handleMouseDown = () => {
    setIsMouseDown(true);
    setStrokePath([]); // Reset the path at the start of a new stroke
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    console.log("Final Stroke Path:", strokePath);
  };

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      // Convert mouse coordinates to relative canvas coordinates
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left - center.x;
      const y = e.clientY - rect.top - center.y;
      setStrokePath((prevPath) => [...prevPath, { x, y }]);
    }
  };

  // checking to see when the stroke path is updated
  useEffect(() => {
  console.log("Stroke Path Updated:", strokePath);
  }, [strokePath]);

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
          isMouseMove={isMouseDown}
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

  const initCoords = async () => {
    loadStrokes().then((data) => {
      data.forEach((el) => drawCoords(el.coordinates, el.color, el.weight));
    });
  };

  const drawCoords = (
    coords: { x: number; y: number }[],
    color: number[],
    weight: number
  ) => {
    p5.strokeWeight(weight);
    p5.stroke(...color);
    p5.noFill();
    p5.beginShape();
    coords.forEach((el) => p5.vertex(el.x, el.y));
    p5.endShape();
  };

  p5.preload = () => {
    initCoords();
  };

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

    // circle for testing panning
    p5.fill(0, 51, 160);
    p5.circle(0, 0, 100);
  };

  p5.mouseDragged = () => {
    if (!isP5Init) return;


    // Variables to store stroke data
    let strokeData = {
      tool: tool,
      color: {r: color.r, g: color.g, b: color.b},
      size: size,
      start: {x: p5.pmouseX - WIDTH / 2 - center.x, y: p5.pmouseY - HEIGHT / 2 - center.y},
      end: {x: p5.mouseX - WIDTH / 2 - center.x, y: p5.mouseY - HEIGHT / 2 - center.y}
    };

    switch (tool) {
      case "Pan":
        // Tool = "Pan"
        center.x += p5.mouseX - p5.pmouseX; // dX
        center.y += p5.mouseY - p5.pmouseY; // dY
        return;

      case "Brush":
        // Tool = "Brush"
        p5.stroke(color.r, color.g, color.b);
        p5.strokeWeight(size);
        break;

      case "Eraser":
        // Tool = "Eraser"
        p5.stroke(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
        p5.strokeWeight(size);
        break;

      case "Color Picker":
        return;
    }
    p5.line(strokeData.start.x, strokeData.start.y, strokeData.end.x, strokeData.end.y);

    // Log stroke data to the console
  console.log("Stroke Data:", JSON.stringify(strokeData));

  };

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
