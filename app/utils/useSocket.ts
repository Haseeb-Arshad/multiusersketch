import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { DrawingTool } from '../components/ToolSelector';

export type Point = {
  x: number;
  y: number;
};

export type Line = {
  points: Point[];
  color: string;
  lineWidth: number;
  id: string;
  tool?: DrawingTool;
};

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [userCount, setUserCount] = useState(0);
  
  useEffect(() => {
    // Create a socket connection
    const newSocket = io('http://localhost:3001');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      
      // Generate or get room ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      let roomIdFromUrl = urlParams.get('room');
      
      if (!roomIdFromUrl) {
        roomIdFromUrl = uuidv4();
        // Update URL with room ID
        const newUrl = `${window.location.pathname}?room=${roomIdFromUrl}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
      
      setRoomId(roomIdFromUrl);
      
      // Join the room
      newSocket.emit('join-room', roomIdFromUrl);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });
    
    newSocket.on('user-count', (count: number) => {
      setUserCount(count);
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  const sendLine = (line: Line) => {
    if (socket && connected && roomId) {
      socket.emit('draw-line', roomId, line);
    }
  };
  
  const clearCanvas = () => {
    if (socket && connected && roomId) {
      socket.emit('clear-canvas', roomId);
    }
  };
  
  const saveSketch = () => {
    if (socket && connected && roomId) {
      socket.emit('save-sketch', roomId);
    }
  };
  
  return {
    socket,
    connected,
    roomId,
    userCount,
    sendLine,
    clearCanvas,
    saveSketch
  };
} 