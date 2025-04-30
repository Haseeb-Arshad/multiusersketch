import { useState, useRef, useCallback, useEffect } from 'react';
import type { MetaFunction } from "@remix-run/node";
import { motion } from 'framer-motion';
import Canvas from '../components/Canvas';
import ColorPicker from '../components/ColorPicker';
import { Toolbar } from '../components/Toolbar';
import Header from '../components/Header';
import useSocket from '../utils/useSocket';
import ToolSelector, { DrawingTool } from '../components/ToolSelector';
import BoardSelector, { BoardStyle, BOARD_STYLES } from '../components/BoardSelector';

export const meta: MetaFunction = () => {
  return [
    { title: "Sketch Together - Multi-user Whiteboard" },
    { name: "description", content: "A collaborative multi-user sketch application" },
  ];
};

export default function Index() {
  // Drawing state
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(2);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [currentBoard, setCurrentBoard] = useState<BoardStyle>(BOARD_STYLES.whiteboard);

  // Saved states
  const [savedBoards, setSavedBoards] = useState<{
    id: string;
    name: string;
    thumbnail?: string;
    timestamp: number;
  }[]>([]);

  // Refs
  const canvasRef = useRef<any>(null);
  
  // Socket connection
  const socket = useSocket();
  const [userCount, setUserCount] = useState(0);
  const [roomLink, setRoomLink] = useState('');

  // Update user count whenever it changes in the socket
  useEffect(() => {
    if (socket) {
      setUserCount(socket.userCount);
    }
  }, [socket.userCount]);

  // Generate shareable room link
  useEffect(() => {
    if (socket && socket.roomId) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', socket.roomId);
      setRoomLink(url.toString());
    }
  }, [socket.roomId]);

  const handleClearCanvas = useCallback(() => {
    if (canvasRef.current && canvasRef.current.clearCanvas) {
      canvasRef.current.clearCanvas();
    }
  }, [canvasRef]);

  const handleSaveSketch = useCallback(() => {
    if (socket) {
      socket.saveSketch();
      
      // Add to saved boards (in a real app, you might get the ID from the server)
      const newBoard = {
        id: `board-${Date.now()}`,
        name: `Board ${savedBoards.length + 1}`,
        timestamp: Date.now()
      };
      
      setSavedBoards(prev => [...prev, newBoard]);
      
      // Show confirmation
      alert('Board saved successfully!');
    }
  }, [socket, savedBoards.length]);
  
  const handleNewBoard = useCallback(() => {
    // First save current board if not empty
    handleSaveSketch();
    
    // Then clear the canvas
    handleClearCanvas();
  }, [handleSaveSketch, handleClearCanvas]);

  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomLink)
      .then(() => {
        alert('Room link copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };
  
  // Handle board style change
  const handleBoardChange = (board: BoardStyle) => {
    setCurrentBoard(board);
    
    // If the board has a background color, update the background color state
    if (board.background) {
      setBackgroundColor(board.background);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Header userCount={userCount} onSave={handleSaveSketch} />
      
      <motion.main 
        className="relative w-full h-full pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Canvas 
          ref={canvasRef}
          color={color} 
          lineWidth={lineWidth}
          socket={socket}
          tool={currentTool}
          boardStyle={currentBoard}
        />
        
        <ToolSelector 
          currentTool={currentTool}
          onToolChange={setCurrentTool}
        />
        
        <BoardSelector 
          currentBoard={currentBoard}
          onBoardChange={handleBoardChange}
        />
        
        <ColorPicker 
          color={color}
          onColorChange={setColor}
        />
        
        <ColorPicker 
          color={backgroundColor}
          onColorChange={setBackgroundColor}
          isBackgroundPicker
        />
        
        <Toolbar 
          selectedTool={currentTool}
          onToolChange={setCurrentTool}
          selectedColor={color}
          onColorChange={setColor}
          lineWidth={lineWidth}
          onLineWidthChange={setLineWidth}
          boardStyle={currentBoard.id}
          onBoardStyleChange={(style: string) => {
            const selectedStyle = Object.values(BOARD_STYLES).find(board => board.id === style);
            if (selectedStyle) {
              handleBoardChange(selectedStyle);
            }
          }}
          onClear={handleClearCanvas}
          onSave={handleSaveSketch}
          onNewBoard={handleNewBoard}
        />
        
        {userCount > 1 && (
          <motion.div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-md text-gray-700 dark:text-gray-200 text-sm"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                }}
              />
              <span>{userCount} users sketching</span>
            </div>
          </motion.div>
        )}
        
        {userCount === 1 && (
          <motion.div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-md flex items-center space-x-2"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <span className="text-gray-700 dark:text-gray-200 text-sm">Share this room</span>
            <motion.button
              onClick={copyRoomLink}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Copy link
            </motion.button>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
