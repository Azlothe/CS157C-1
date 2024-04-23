import { RGB } from "@/types/shared";

declare namespace Strokes {
  declare type Coordinate = {
    x: number;
    y: number;
  };

  declare type Stroke = {
    username: string
    email: string
    coordinates: Coordinate[]
    color: RGB
    weight: number
  };
}
