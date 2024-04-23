import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from "@p5-wrapper/react";
import { Tool, RGB } from "../types/shared.tsx";
import { loadStrokes } from "../services/CanvasService.ts";
import { Strokes } from "@/data/models/Strokes.js";

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

const sendStrokeDataToServer = async (strokeData: Strokes.Stroke) => {
  try {
    // Notice the full URL including the port number (3000) is specified here
    const response = await fetch(`${import.meta.env.VITE_SERVER}/strokes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(strokeData),
    });
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    console.log("Stroke data sent successfully to the server.");
  } catch (error) {
    console.error("Failed to send stroke data:", error);
  }
};

function Canvas({ tool, color, size, center, updateCenter }: Props) {
  return (
    <>
      <div>
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

let strokes : Strokes.Stroke[] = [];

function sketch(p5: P5CanvasInstance<CustomSketchProps>) {
  let isP5Init = false;
  const center = DEFAULT_CENTER;
  let tool : Tool = DEFAULT_TOOL;
  let color = DEFAULT_COLOR;
  let size = DEFAULT_SIZE;

  let scaleFactor = 1;

  let isDrawing = false;

  const initCoords = async () => {
    loadStrokes().then((data) => {
      strokes = data;
      // data.forEach((el) => drawCoords(el.coordinates, el.color, el.weight));
    });
  };

  const drawStroke = (
    coords: Strokes.Coordinate[],
    color: RGB,
    weight: number
  ) => {
    p5.strokeWeight(weight);
    p5.stroke(Object.values(color));
    p5.noFill();
    p5.beginShape();
    coords?.forEach((el) => p5.curveVertex(el.x, el.y));
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

    p5.scale(scaleFactor);

    // panning
    p5.translate(center.x, center.y);

    // draw elements in sorted order
    strokes.forEach((el : Strokes.Stroke) => drawStroke(el.coordinates, el.color, el.weight));

    // circle for testing panning
    p5.fill(0, 51, 160);
    p5.circle(0, 0, 100);

    p5.noFill();

    drawStroke(currentStroke.coordinates, currentStroke.color, currentStroke.weight);

  };

  const currentStroke: Strokes.Stroke = {
    username: "MikeWu",
    email: "mikewu@gmail.com",
    coordinates: [],
    color: DEFAULT_COLOR,
    weight: DEFAULT_SIZE,
  };

  p5.mousePressed = () => {
    if (isP5Init && tool === "Brush") {
      currentStroke.weight = size;
      currentStroke.color = { r: color.r, g: color.g, b: color.b };
      
      currentStroke.coordinates = [];
      currentStroke.coordinates.push({
        x: (p5.pmouseX - WIDTH / 2 - center.x) / scaleFactor,
        y: (p5.pmouseY - HEIGHT / 2 - center.y) / scaleFactor,
      });
      
    }
    
  };
  
  p5.mouseReleased = () => {
    if (isDrawing) {
      isDrawing = false;
      console.log("Stroke Data: ", JSON.stringify(currentStroke));
      strokes.push({ ...currentStroke });
      sendStrokeDataToServer(currentStroke);
    }
  };

  p5.mouseDragged = () => {
    if (!isP5Init) return;

    switch (tool) {
      case "Pan":
        // Tool = "Pan"
        center.x += p5.mouseX - p5.pmouseX; // dX
        center.y += p5.mouseY - p5.pmouseY; // dY
        return;

      case "Color Picker":
        return;
    }

    isDrawing = true;
    currentStroke.coordinates.push({
      x: (p5.mouseX - WIDTH / 2 - center.x) / scaleFactor,
      y: (p5.mouseY - HEIGHT / 2 - center.y) / scaleFactor,
    });
  };

  p5.mouseWheel = (event: WheelEvent) => {
    p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
    scaleFactor *= event.deltaY < 0 ? 1.05 : 0.95;
  };

  p5.mouseMoved = () => {
    if (!isP5Init || tool !== "Pan" || strokes.length <= 0) return;

    const mouseXOffset = p5.mouseX - WIDTH / 2 - center.x;
    const mouseYOffset = p5.mouseY - HEIGHT / 2 - center.y;

    // Check if the mouse is hovering over any stroke
    for (const stroke of strokes) {
      for (let i = 0; i < stroke.coordinates.length - 1; i++) {
        const p = stroke.coordinates[i];
        const dist = p5.dist(p.x, p.y, mouseXOffset, mouseYOffset);
        if (dist <= stroke.weight) {
          // use strokeWeight as distance threshold
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
