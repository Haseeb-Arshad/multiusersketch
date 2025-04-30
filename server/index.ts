import { Server } from 'socket.io';
import http from 'http';
import { join } from 'path';
import fs from 'fs';

// Types for our sketch data
type Point = {
  x: number;
  y: number;
};

type DrawingTool = 'pencil' | 'marker' | 'pen' | 'brush' | 'eraser';

type Line = {
  points: Point[];
  color: string;
  lineWidth: number;
  id: string;
  tool?: DrawingTool; // Optional tool type
};

// Store for sketch data
type Board = {
  id: string;
  name: string;
  lines: Line[];
  createdAt: number;
  updatedAt: number;
  background?: string;
  backgroundPattern?: string;
};

type Room = {
  id: string;
  boards: Board[];
  currentBoardId: string;
  users: string[];
};

// In-memory store for rooms
const rooms: Map<string, Room> = new Map();

// Create HTTP server
const server = http.createServer();

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Data directory for saving sketches
const DATA_DIR = join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper function to create a new board
function createNewBoard(boardId: string, name = 'New Board'): Board {
  return {
    id: boardId,
    name,
    lines: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

// Helper function to get the current board for a room
function getCurrentBoard(roomId: string): Board | null {
  const room = rooms.get(roomId);
  if (!room) return null;
  
  const board = room.boards.find(b => b.id === room.currentBoardId);
  return board || null;
}

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a room
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    
    // Create room if it doesn't exist
    if (!rooms.has(roomId)) {
      const initialBoardId = `board-${Date.now()}`;
      rooms.set(roomId, {
        id: roomId,
        boards: [createNewBoard(initialBoardId, 'Board 1')],
        currentBoardId: initialBoardId,
        users: []
      });
    }
    
    // Add user to room
    const room = rooms.get(roomId)!;
    room.users.push(socket.id);
    
    // Send current board state to new user
    const currentBoard = getCurrentBoard(roomId);
    if (currentBoard) {
      socket.emit('init-canvas', currentBoard.lines);
    }
    
    // Notify all users in the room
    io.to(roomId).emit('user-count', room.users.length);
    
    console.log(`User ${socket.id} joined room ${roomId}`);
  });
  
  // Draw line
  socket.on('draw-line', (roomId: string, line: Line) => {
    if (!rooms.has(roomId)) return;
    
    const board = getCurrentBoard(roomId);
    if (board) {
      board.lines.push(line);
      board.updatedAt = Date.now();
      
      // Broadcast to all users in the room except sender
      socket.to(roomId).emit('line-drawn', line);
    }
  });
  
  // Clear canvas
  socket.on('clear-canvas', (roomId: string) => {
    if (!rooms.has(roomId)) return;
    
    const board = getCurrentBoard(roomId);
    if (board) {
      board.lines = [];
      board.updatedAt = Date.now();
      
      // Broadcast to all users in the room except sender
      socket.to(roomId).emit('canvas-cleared');
    }
  });
  
  // Save sketch
  socket.on('save-sketch', (roomId: string) => {
    if (!rooms.has(roomId)) return;
    
    const room = rooms.get(roomId)!;
    const board = getCurrentBoard(roomId);
    
    if (board) {
      // Update timestamp
      board.updatedAt = Date.now();
      
      // Save board to file system
      const filePath = join(DATA_DIR, `${roomId}_${board.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(board), 'utf-8');
      
      // Notify the user that the sketch was saved
      socket.emit('sketch-saved', { success: true, boardId: board.id });
    }
  });
  
  // Create new board
  socket.on('new-board', (roomId: string, name?: string) => {
    if (!rooms.has(roomId)) return;
    
    const room = rooms.get(roomId)!;
    const boardId = `board-${Date.now()}`;
    const boardName = name || `Board ${room.boards.length + 1}`;
    
    const newBoard = createNewBoard(boardId, boardName);
    room.boards.push(newBoard);
    room.currentBoardId = boardId;
    
    // Clear canvas for all users and set to new board
    io.to(roomId).emit('canvas-cleared');
    io.to(roomId).emit('board-changed', boardId);
    
    // Notify the user that the board was created
    socket.emit('board-created', { success: true, boardId });
  });
  
  // Switch to a different board
  socket.on('switch-board', (roomId: string, boardId: string) => {
    if (!rooms.has(roomId)) return;
    
    const room = rooms.get(roomId)!;
    const boardExists = room.boards.some(b => b.id === boardId);
    
    if (boardExists) {
      room.currentBoardId = boardId;
      const board = getCurrentBoard(roomId);
      
      if (board) {
        // Update all users with the new board
        io.to(roomId).emit('canvas-cleared');
        io.to(roomId).emit('init-canvas', board.lines);
        io.to(roomId).emit('board-changed', boardId);
      }
    }
  });
  
  // Get list of boards
  socket.on('get-boards', (roomId: string) => {
    if (!rooms.has(roomId)) return;
    
    const room = rooms.get(roomId)!;
    
    // Send list of boards (without the lines to keep it small)
    const boardsList = room.boards.map(({ id, name, createdAt, updatedAt }) => ({
      id,
      name,
      createdAt,
      updatedAt
    }));
    
    socket.emit('boards-list', boardsList);
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms
    for (const [roomId, room] of rooms.entries()) {
      const userIndex = room.users.indexOf(socket.id);
      
      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);
        
        // Notify remaining users
        io.to(roomId).emit('user-count', room.users.length);
        
        // Remove room if empty
        if (room.users.length === 0) {
          // Before removing, save all boards to permanent storage
          room.boards.forEach(board => {
            const filePath = join(DATA_DIR, `${roomId}_${board.id}.json`);
            fs.writeFileSync(filePath, JSON.stringify(board), 'utf-8');
          });
          
          rooms.delete(roomId);
        }
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 