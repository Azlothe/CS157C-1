import { useState } from "react";
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from "@p5-wrapper/react";
import { Tool, RGB } from "../types/shared.tsx";
import { loadStrokes } from "../services/CanvasService.ts";
import { useEffect } from "react";
import { Vector } from "p5";


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


  const sendStrokeDataToServer = async (strokeData) => {
    try {
      // Notice the full URL including the port number (3000) is specified here
      const response = await fetch('http://localhost:3000/api/strokes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(strokeData),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      console.log("Stroke data sent successfully to the server.");
    } catch (error) {
      console.error('Failed to send stroke data:', error);
    }
  };
  

  const handleMouseDown = () => {
    setIsMouseDown(true);
    setStrokePath([]); // Reset the path at the start of a new stroke
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  
    // Convert the color object to an array (tuple)
    const colorTuple = [color.r, color.g, color.b];
  
    // Preparing the stroke data according to the backend schema
    const strokeData = {
      userID: 1, // Assuming this is securely managed and just an example here
      username: "MikeWu", // Same as above, example usage
      coordinates: strokePath, // Directly using the strokePath as coordinates
      color: colorTuple,
      weight: size, // Using the size state as weight
    };
  
    // Logging the stroke data to the console
    console.log("Stroke Data:", JSON.stringify(strokeData));

    // Send the stroke data to the server
    sendStrokeDataToServer(strokeData);
  };

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      setIsMouseMove(!isMouseMove);
      
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

let strokes = [];

function sketch(p5: P5CanvasInstance<CustomSketchProps>) {
  let isP5Init = false;
  const center = DEFAULT_CENTER;
  let tool = DEFAULT_TOOL;
  let color = DEFAULT_COLOR;
  let size = DEFAULT_SIZE;

  const initCoords = async () => {
    loadStrokes().then((data) => {
      strokes = data;
      // data.forEach((el) => drawCoords(el.coordinates, el.color, el.weight));
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

    p5.scale(scaleFactor);
    
    // draw elements in sorted order
    strokes.forEach((el) => drawCoords(el.coordinates, el.color, el.weight));

    // circle for testing panning
    p5.fill(0, 51, 160);
    p5.circle(0, 0, 100);

    p5.noFill();
    switch (tool) {
      case "Brush":
        p5.stroke(color.r, color.g, color.b);
        break;

      case "Eraser":
        p5.stroke(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
        break;
    }
    p5.strokeWeight(size);  
    p5.beginShape();
    currentPos.forEach(coord => p5.curveVertex(coord.x, coord.y));
    p5.endShape();
  };

  let currentPos : Vector[] = [];

  p5.mousePressed = () => {
    if (isP5Init && tool === "Brush") {
      currentPos = [];
      currentPos.push(p5.createVector(p5.pmouseX - WIDTH / 2 - center.x, p5.pmouseY - HEIGHT / 2 - center.y));
    }
  }

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
        // p5.stroke(color.r, color.g, color.b);
        // p5.strokeWeight(size);
        break;

      case "Eraser":
        // Tool = "Eraser"
        // p5.stroke(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
        // p5.strokeWeight(size);
        // color.r = BG_COLOR.r;
        // color.g = BG_COLOR.g;
        // color.b = BG_COLOR.b;
        break;

      case "Color Picker":
        return;
    }
    // p5.line(strokeData.start.x, strokeData.start.y, strokeData.end.x, strokeData.end.y);
    currentPos.push(p5.createVector(strokeData.end.x, strokeData.end.y));

    // Log stroke data to the console
    console.log("Stroke Data:", JSON.stringify(strokeData));
  };

  let scaleFactor = 1;

  p5.mouseWheel = (event : WheelEvent) => {
    p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
    scaleFactor *= event.deltaY < 0 ? 1.05 : 0.95;
  }

  p5.mouseMoved = () => {
    if (!isP5Init || tool !== "Pan" || strokes.length <= 0) return;

    const mouseXOffset = p5.mouseX - WIDTH / 2 - center.x;
    const mouseYOffset = p5.mouseY - HEIGHT / 2 - center.y;

    // Check if the mouse is hovering over any stroke
    for (const stroke of strokes) {
      for (let i = 0; i < stroke.coordinates.length - 1; i++) {
        const p = stroke.coordinates[i];
        const dist = p5.dist(p.x, p.y, mouseXOffset, mouseYOffset);
        if (dist <= stroke.weight) { // use strokeWeight as distance threshold
            console.log(stroke.username);
            return;
        }
      }
    }
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
