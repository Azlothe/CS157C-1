import { useState, useEffect } from "react";
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from "@p5-wrapper/react";
import { Tool, RGB } from "../types/shared.tsx";
import { loadStrokes, sendStrokeDataToServer } from "../services/CanvasService.ts";
import { Strokes } from "@/data/models/Strokes.js";
import { getEmail } from "../context/AuthContext.ts";
import { getUser } from "@/services/AuthService";
import Tooltip from "@mui/material/Tooltip";

const BG_COLOR: RGB = {
  r: 255,
  g: 255,
  b: 255,
};
const DEFAULT_CENTER = { x: 0, y: 0 };
const DEFAULT_TOOL = "Brush";
const DEFAULT_COLOR = { r: 0, g: 0, b: 0 };
const DEFAULT_SIZE = 8;

let currentUsername: string;
let currentUserEmail: string;
let hoveredUsername: string | undefined;

interface Props {
  tool: Tool;
  color: RGB;
  size: number;
  center: { x: number; y: number };
  updateCenter: (center: { x: number; y: number }) => void;
}

function Canvas({ tool, color, size, center, updateCenter }: Props) {
  // these states are used for p5.updateWithProps so the center coordinate display updates
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseMove, setIsMouseMove] = useState(false);

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

  useEffect(() => {
    const getEmailAsync = async () => {
      try {
        const email = await getEmail();
        const user = await getUser(email);
        currentUsername = user.username;
        currentUserEmail = email;
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };

    getEmailAsync();
  }, []);

  return (
    <>
      <Tooltip
        title={hoveredUsername}
        placement="top-start"
        followCursor
      >
        <div
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
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
      </Tooltip>
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

let strokes: Strokes.Stroke[] = [];

function sketch(p5: P5CanvasInstance<CustomSketchProps>) {
  let isP5Init = false;
  const center = DEFAULT_CENTER;
  let tool: Tool = DEFAULT_TOOL;
  let color = DEFAULT_COLOR;
  let size = DEFAULT_SIZE;

  let scaleFactor = 1;

  let isDrawing = false;

  const calculateCoord = (mouseX : number, mouseY : number) => {
    return {
      x: (mouseX - window.innerWidth / 2 - center.x) / scaleFactor,
      y: (mouseY - window.innerHeight / 2 - center.y) / scaleFactor,
    };
  };

  /**
   * NOTE:
   * Up on the y-axis is negative, whereas down is positive. This is in sync with how canvas coordinates are calculated.
   *  Left -> Right: Negative -> Positive
   *  Top -> Bottom: Negative -> Positive
   */
  const calculateBound = () => {
    const leftAnchor = (-window.innerWidth/2 - center.x);
    const topAnchor = (-window.innerHeight / 2 - center.y);
    return {
      left: leftAnchor / scaleFactor,
      top: topAnchor / scaleFactor,
      right: (leftAnchor + window.innerWidth) / scaleFactor,
      bottom: (topAnchor + window.innerHeight) / scaleFactor,
    };
  };

  const initCoords = async () => {
    const { left, top, right, bottom } = calculateBound();
    loadStrokes(left, top, right, bottom).then((data) => {
      strokes = data;
    });
  };

  const drawStroke = (
    coords: Strokes.Coordinate[],
    color: RGB,
    weight: number
  ) => {
    p5.strokeWeight(weight * scaleFactor);
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
    p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);
    p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
    p5.frameRate(60);
    isP5Init = true;
  };

  p5.windowResized = () => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
    p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
  }

  // loops continuously
  p5.draw = () => {
    if (tool === "Pan") {
      p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
    }

    p5.scale(scaleFactor);

    // panning
    p5.translate(center.x, center.y);

    // draw elements in sorted order
    strokes.forEach((el: Strokes.Stroke) =>
      drawStroke(el.coordinates, el.color, el.weight)
    );

    // circle for testing panning
    p5.noStroke();
    p5.fill(0, 51, 160);
    p5.circle(0, 0, 100);

    p5.noFill();

    drawStroke(
      currentStroke.coordinates,
      currentStroke.color,
      currentStroke.weight
    );
  };

  const currentStroke: Strokes.Stroke = {
    username: currentUsername,
    email: currentUserEmail,
    coordinates: [],
    color: DEFAULT_COLOR,
    weight: DEFAULT_SIZE,
  };

  p5.mousePressed = () => {
    if (!isP5Init) return;

    switch (tool) {
      case "Pan":
      case "Color Picker":
        return;
      
      case "Brush":
        currentStroke.color = color;
        break;
        
      case "Eraser":
        currentStroke.color = BG_COLOR;
        break;
    }

    currentStroke.username = currentUsername;
    currentStroke.email = currentUserEmail;
    
    currentStroke.weight = size;

    currentStroke.coordinates = [];
    currentStroke.coordinates.push(calculateCoord(p5.pmouseX, p5.pmouseY));
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

    if (p5.mouseButton === p5.LEFT) {
      switch (tool) {
        case "Pan":
          center.x += p5.mouseX - p5.pmouseX; // dX
          center.y += p5.mouseY - p5.pmouseY; // dY
          return;

        case "Brush":
        case "Eraser":
          isDrawing = true;
          currentStroke.coordinates.push(calculateCoord(p5.mouseX, p5.mouseY));
          return;

        case "Color Picker":
          return;
      }
    }
  };

  p5.mouseWheel = (event: WheelEvent) => {
    p5.background(BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
    scaleFactor *= event.deltaY < 0 ? 1.05 : 0.95;
  };

  p5.mouseMoved = () => {
    if (!isP5Init || tool !== "Pan" || strokes.length <= 0) return;

    const { x: mouseXOffset, y: mouseYOffset } = calculateCoord(p5.mouseX, p5.mouseY);
    
    // Check if the mouse is hovering over any stroke
    for (const stroke of strokes) {
      for (let i = 0; i < stroke.coordinates.length - 1; i++) {
        const p = stroke.coordinates[i];
        const dist = p5.dist(p.x, p.y, mouseXOffset, mouseYOffset);
        if (dist <= stroke.weight) {
          // use strokeWeight as distance threshold
          console.log(stroke.username + ", " + stroke.email);
          hoveredUsername = stroke.username;
          return;
        } else {
          hoveredUsername = undefined;
        }
      }
    }
  };

  p5.updateWithProps = (props) => {
    // to fix negative zeros
    const newX = center.x === 0 ? 0 : -center.x;
    const newY = center.y === 0 ? 0 : -center.y;

    if (tool === "Pan" && props.isMouseMove) {
      // console.log("update center to {" + newX + ", " + newY + "}");
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
