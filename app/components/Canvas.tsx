import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import useWindowSize from '../utils/useWindowSize';
import { v4 as uuidv4 } from 'uuid';
import { Line, Point } from '../utils/useSocket';
import { DrawingTool } from './ToolSelector';
import { BoardStyle } from './BoardSelector';

interface CanvasProps {
  color: string;
  lineWidth: number;
  socket: any;
  tool: DrawingTool;
  boardStyle: BoardStyle;
}

// Add paper texture variables
const TEXTURES = {
  sketch: 'url(data:image/png;base64,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)',
  lined: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
  grid: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)'
};

const Canvas = forwardRef<{ clearCanvas: () => void }, CanvasProps>(
  ({ color, lineWidth, socket, tool, boardStyle }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lines, setLines] = useState<Line[]>([]);
    const [currentLine, setCurrentLine] = useState<Line | null>(null);
    const { width, height } = useWindowSize();
    const [pressure, setPressure] = useState(1.0); // For pressure sensitivity
    const [tilt, setTilt] = useState({ x: 0, y: 0 }); // For pencil tilt
    const [lastPoint, setLastPoint] = useState<Point | null>(null);
    const [textureLoaded, setTextureLoaded] = useState(false);
    const textureRef = useRef<HTMLImageElement | null>(null);

    // Expose the clearCanvas method to the parent component
    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        setLines([]);
        
        // Emit clear canvas event to server
        if (socket) {
          socket.clearCanvas();
        }
      }
    }));

    // Handle socket events
    useEffect(() => {
      if (!socket || !socket.socket) return;

      // Initialize canvas with existing lines
      socket.socket.on('init-canvas', (initialLines: Line[]) => {
        setLines(initialLines);
      });

      // Add line drawn by other users
      socket.socket.on('line-drawn', (line: Line) => {
        setLines((prevLines) => [...prevLines, line]);
      });

      // Clear canvas when other user clears
      socket.socket.on('canvas-cleared', () => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        setLines([]);
      });

      return () => {
        socket.socket.off('init-canvas');
        socket.socket.off('line-drawn');
        socket.socket.off('canvas-cleared');
      };
    }, [socket]);

    // Handle canvas resize
    useEffect(() => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Set canvas dimensions to match window size
      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw all lines
      lines.forEach(line => {
        if (line.points.length < 2) return;
        
        drawLine(context, line);
      });
    }, [lines, width, height]);

    // Load paper texture for realistic pencil effect
    useEffect(() => {
      if (tool === 'pencil' && !textureRef.current) {
        const texture = new Image();
        texture.src = 'data:image/png;base64,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';
        texture.onload = () => {
          textureRef.current = texture;
          setTextureLoaded(true);
        };
      }
    }, [tool]);

    // Configure drawing styles based on the selected tool and board type
    const getDrawingStyles = (ctx: CanvasRenderingContext2D, selectedTool: DrawingTool, selectedColor: string, selectedWidth: number, currentPressure = 1) => {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = selectedWidth * currentPressure;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      
      switch (selectedTool) {
        case 'pencil':
          // Pencil behavior changes based on board type
          if (boardStyle.id === 'whiteboard') {
            // Slightly transparent for whiteboard - harder surface
            ctx.globalAlpha = 0.8;
            ctx.shadowColor = selectedColor;
            ctx.shadowBlur = 0;
          } else if (boardStyle.id === 'sketch') {
            // More grainy effect for sketch paper - softer surface
            ctx.globalAlpha = 0.7 + (currentPressure * 0.3);
            // Add texture
            if (textureRef.current) {
              ctx.strokeStyle = selectedColor;
            }
          } else {
            // Default pencil on lined/dotted/grid
            ctx.globalAlpha = 0.75 + (currentPressure * 0.25);
          }
          break;
          
        case 'marker':
          // Marker - wide, slightly blurred, alcohol-based ink effect
          ctx.globalAlpha = 0.7;
          ctx.shadowColor = selectedColor;
          ctx.shadowBlur = boardStyle.id === 'whiteboard' ? 1 : 2;
          // Markers blend colors
          ctx.globalCompositeOperation = 'multiply';
          break;
          
        case 'pen':
          // Ballpoint pen - clean, precise lines
          ctx.globalAlpha = 0.95;
          ctx.shadowBlur = 0;
          // Pen is less affected by surface type
          break;
          
        case 'brush':
          // Brush - soft edges, watercolor-like
          ctx.globalAlpha = 0.5 + (currentPressure * 0.3);
          ctx.shadowColor = selectedColor;
          ctx.shadowBlur = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          // Brushes blend on paper-based surfaces
          if (boardStyle.id !== 'whiteboard') {
            ctx.globalCompositeOperation = 'multiply';
          }
          break;
          
        case 'eraser':
          // Eraser - use background color
          ctx.globalAlpha = 1;
          ctx.strokeStyle = boardStyle.background;
          ctx.shadowBlur = 0;
          // Wider for eraser with varying pressure
          ctx.lineWidth = (selectedWidth * 2) * currentPressure;
          // Use destination-out for transparent erasers
          ctx.globalCompositeOperation = 'destination-out';
          break;
      }
    };

    // Draw a line with realistic physics for each tool
    const drawLine = (ctx: CanvasRenderingContext2D, line: Line) => {
      if (line.points.length < 2) return;
      
      const currentTool = line.tool || 'pen'; // Default to pen if no tool
      
      // For curved lines - use bezier curves for smoother drawing
      const drawSmoothLine = (points: Point[]) => {
        ctx.beginPath();
        
        // Apply drawing styles
        getDrawingStyles(ctx, currentTool as DrawingTool, line.color, line.lineWidth);
        
        // Start at the first point
        ctx.moveTo(points[0].x, points[0].y);
        
        // Draw bezier curves between points for smoother lines
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        
        // Connect the last two points
        if (points.length > 2) {
          const lastIndex = points.length - 1;
          ctx.quadraticCurveTo(
            points[lastIndex - 1].x, 
            points[lastIndex - 1].y, 
            points[lastIndex].x, 
            points[lastIndex].y
          );
        }
        
        ctx.stroke();
      };
      
      // Draw pencil with texture and jitter
      const drawPencilLine = (points: Point[]) => {
        if (points.length < 2) return;
        
        // Pencil has texture effect
        ctx.beginPath();
        
        // Apply pencil-specific styles
        getDrawingStyles(ctx, 'pencil', line.color, line.lineWidth);
        
        ctx.moveTo(points[0].x, points[0].y);
        
        // Add slight jitter for pencil texture based on board type
        const jitterAmount = boardStyle.id === 'whiteboard' ? 0.1 : 
                            boardStyle.id === 'sketch' ? 0.3 : 0.2;
        
        // Vary pressure slightly for natural look
        for (let i = 1; i < points.length; i++) {
          // Calculate distance to modify pressure
          const distance = i > 1 
            ? Math.sqrt(
                Math.pow(points[i].x - points[i-1].x, 2) + 
                Math.pow(points[i].y - points[i-1].y, 2)
              ) 
            : 0;
          
          // Faster drawing = less pressure
          const speed = Math.min(distance / 5, 1);
          const varyingPressure = Math.max(0.7, 1 - (speed * 0.3));
          
          // Apply pressure variation to styles
          ctx.lineWidth = line.lineWidth * varyingPressure;
          
          // Add realistic jitter based on speed and board texture
          const jitter = jitterAmount * Math.random() * varyingPressure;
          const jitterX = (Math.random() - 0.5) * jitter;
          const jitterY = (Math.random() - 0.5) * jitter;
          
          ctx.lineTo(points[i].x + jitterX, points[i].y + jitterY);
        }
        
        ctx.stroke();
        
        // Restore default settings
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      };
      
      // Draw marker with proper blending
      const drawMarkerLine = (points: Point[]) => {
        if (points.length < 2) return;
        
        ctx.beginPath();
        
        // Apply marker-specific styles
        getDrawingStyles(ctx, 'marker', line.color, line.lineWidth);
        
        ctx.moveTo(points[0].x, points[0].y);
        
        // Markers have consistent pressure - use smooth curves
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        
        // Connect last points
        if (points.length > 2) {
          const lastIndex = points.length - 1;
          ctx.quadraticCurveTo(
            points[lastIndex - 1].x, 
            points[lastIndex - 1].y, 
            points[lastIndex].x, 
            points[lastIndex].y
          );
        }
        
        ctx.stroke();
        
        // Restore defaults
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
      };
      
      // Choose drawing method based on tool
      switch (currentTool) {
        case 'pencil':
          drawPencilLine(line.points);
          break;
        case 'marker':
          drawMarkerLine(line.points);
          break;
        case 'brush':
          // Draw brush with varying pressure
          ctx.beginPath();
          getDrawingStyles(ctx, 'brush', line.color, line.lineWidth);
          
          ctx.moveTo(line.points[0].x, line.points[0].y);
          
          for (let i = 1; i < line.points.length - 2; i++) {
            // Calculate speed to vary pressure
            const distance = Math.sqrt(
              Math.pow(line.points[i].x - line.points[i-1].x, 2) + 
              Math.pow(line.points[i].y - line.points[i-1].y, 2)
            );
            
            // Faster = less pressure
            const pressure = Math.max(0.5, 1 - (distance * 0.02));
            
            // Update styles with pressure
            getDrawingStyles(ctx, 'brush', line.color, line.lineWidth, pressure);
            
            const xc = (line.points[i].x + line.points[i + 1].x) / 2;
            const yc = (line.points[i].y + line.points[i + 1].y) / 2;
            ctx.quadraticCurveTo(line.points[i].x, line.points[i].y, xc, yc);
          }
          
          // Connect last points
          if (line.points.length > 2) {
            const lastIndex = line.points.length - 1;
            ctx.quadraticCurveTo(
              line.points[lastIndex - 1].x, 
              line.points[lastIndex - 1].y, 
              line.points[lastIndex].x, 
              line.points[lastIndex].y
            );
          }
          
          ctx.stroke();
          
          // Restore defaults
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'source-over';
          break;
        default:
          // Use smooth lines for pen and eraser
          drawSmoothLine(line.points);
      }
      
      // Reset all context settings
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
    };

    // Start drawing
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Use pointer pressure if available (for tablets/stylus)
      const pointerPressure = e.pressure > 0 ? e.pressure : 1;
      setPressure(pointerPressure);
      
      // Capture tilt for pencil physics (if available)
      if (e.tiltX || e.tiltY) {
        setTilt({ x: e.tiltX, y: e.tiltY });
      }
      
      const newLine: Line = {
        points: [{ x, y }],
        color,
        lineWidth,
        id: uuidv4(),
        tool
      };
      
      setCurrentLine(newLine);
      setIsDrawing(true);
      setLastPoint({ x, y });
    };

    // Draw with enhanced physics
    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !currentLine || !canvasRef.current || !lastPoint) return;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update pressure and tilt if available
      if (e.pressure > 0) {
        setPressure(e.pressure);
      }
      
      if (e.tiltX || e.tiltY) {
        setTilt({ x: e.tiltX, y: e.tiltY });
      }
      
      // Calculate distance and velocity for physics-based effects
      const distance = Math.sqrt(
        Math.pow(x - lastPoint.x, 2) + 
        Math.pow(y - lastPoint.y, 2)
      );
      
      // Only add point if distance is significant (reduces points for optimization)
      if (distance > 0.5) {
        const updatedLine = {
          ...currentLine,
          points: [...currentLine.points, { x, y }],
        };
        
        // Clear and redraw for animated effect
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw all existing lines
        lines.forEach(line => {
          drawLine(context, line);
        });
        
        // Draw the current line being created
        drawLine(context, updatedLine);
        
        setCurrentLine(updatedLine);
        setLastPoint({ x, y });
      }
    };

    // Stop drawing with enhanced physics completion
    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (currentLine) {
        if (currentLine.points.length > 1) {
          // Add a final point with subtle smoothing
          if (lastPoint && e.clientX && e.clientY) {
            const canvas = canvasRef.current;
            if (canvas) {
              const rect = canvas.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              // Smooth ending by interpolating final point
              const finalX = (lastPoint.x + x) / 2;
              const finalY = (lastPoint.y + y) / 2;
              
              const finalLine = {
                ...currentLine,
                points: [...currentLine.points, { x: finalX, y: finalY }],
              };
              
              setLines((prevLines) => [...prevLines, finalLine]);
              
              // Send line to server
              if (socket) {
                socket.sendLine(finalLine);
              }
            }
          } else {
            setLines((prevLines) => [...prevLines, currentLine]);
            
            // Send line to server
            if (socket) {
              socket.sendLine(currentLine);
            }
          }
        }
      }
      
      // Reset states
      setCurrentLine(null);
      setIsDrawing(false);
      setLastPoint(null);
      setPressure(1.0);
    };

    // Get cursor style with enhanced cursor feedback
    const getCursorStyle = () => {
      // Base styles with tool-specific feedback
      const baseCursors = {
        pencil: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m18 2-4 4-10 10L2 22l6-2 10-10 4-4'/%3E%3Cpath d='m14 6 4 4'/%3E%3C/svg%3E") 2 22, crosshair`,
        marker: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 16V5a2 2 0 0 1 2-2h5.5L15 7.5V16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'/%3E%3Cpath d='M10 2v5h5'/%3E%3C/svg%3E") 5 16, crosshair`,
        pen: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/%3E%3C/svg%3E") 2 22, crosshair`,
        brush: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 8c0 2-2 2-2 4v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1v-10c0-2-2-2-2-4V5h12z'/%3E%3Cpath d='M14 5h-4V3h4z'/%3E%3C/svg%3E") 4 22, crosshair`,
        eraser: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21'/%3E%3Cpath d='M22 21H7'/%3E%3Cpath d='m5 11 9 9'/%3E%3C/svg%3E") 5 20, crosshair`,
      };
      
      return baseCursors[tool] || 'crosshair';
    };

    return (
      <motion.div 
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="absolute inset-0 w-full h-full transition-all duration-300" 
          style={{ 
            backgroundColor: boardStyle.background,
            backgroundImage: boardStyle.pattern || TEXTURES[boardStyle.id as keyof typeof TEXTURES] || 'none',
            backgroundSize: boardStyle.id === 'grid' ? '20px 20px' : 
                          boardStyle.id === 'dotted' ? '20px 20px' : 
                          boardStyle.id === 'lined' ? '100% 20px' : 
                          boardStyle.id === 'sketch' ? '100px 100px' : 'auto'
          }}
        />
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none transition-all duration-300"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ 
            cursor: getCursorStyle(),
            // Apply backdrop effects for eraser
            backdropFilter: tool === 'eraser' ? 'none' : 'none'
          }}
        />
      </motion.div>
    );
  }
);

Canvas.displayName = 'Canvas';

export default Canvas; 