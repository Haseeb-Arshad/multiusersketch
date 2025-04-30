// Drawing tool types
export type DrawingTool = 'pencil' | 'marker' | 'pen' | 'brush' | 'eraser';

// Board style interface
export interface BoardStyle {
  id: string;
  name: string;
  background: string;
  pattern: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  color: string;
}

// Drawing point interface
export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

// Line interface for drawing
export interface DrawingLine {
  points: Point[];
  color: string;
  width: number;
  tool: DrawingTool;
  userId: string;
} 