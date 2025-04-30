import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type BoardType = 'whiteboard' | 'sketch' | 'dotted' | 'lined' | 'grid';

export interface BoardStyle {
  id: BoardType;
  name: string;
  background: string;
  pattern?: string;
}

interface BoardSelectorProps {
  currentBoard: BoardStyle;
  onBoardChange: (board: BoardStyle) => void;
}

export const BOARD_STYLES: Record<BoardType, BoardStyle> = {
  whiteboard: {
    id: 'whiteboard',
    name: 'White Board',
    background: '#ffffff'
  },
  sketch: {
    id: 'sketch',
    name: 'Sketch Paper',
    background: '#f8f8f0',
    pattern: 'radial-gradient(#e0e0e0 1px, transparent 1px)'
  },
  dotted: {
    id: 'dotted',
    name: 'Dotted Grid',
    background: '#ffffff',
    pattern: 'radial-gradient(#d0d0d0 1px, transparent 1px)'
  },
  lined: {
    id: 'lined',
    name: 'Lined Paper',
    background: '#ffffff',
    pattern: 'linear-gradient(0deg, transparent 9px, #e0e0e0 10px)'
  },
  grid: {
    id: 'grid',
    name: 'Grid Paper',
    background: '#ffffff',
    pattern: 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)'
  }
};

export default function BoardSelector({ currentBoard, onBoardChange }: BoardSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const boardOptions = Object.values(BOARD_STYLES);

  return (
    <motion.div
      className="absolute top-24 right-6 z-10"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.4
      }}
    >
      <motion.div className="flex flex-col items-center">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="bg-white/90 backdrop-blur-md dark:bg-gray-800/90 mb-3 rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, width: 0, height: 0 }}
              animate={{ opacity: 1, width: 'auto', height: 'auto' }}
              exit={{ opacity: 0, width: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 w-48">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4 py-2">Board Style</h3>
                {boardOptions.map((board) => (
                  <motion.button
                    key={board.id}
                    className={`flex items-center w-full px-4 py-3 rounded-xl mb-1 last:mb-0 ${
                      currentBoard.id === board.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => {
                      onBoardChange(board);
                      setIsExpanded(false);
                    }}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg mr-3 border border-gray-200 dark:border-gray-700 overflow-hidden"
                      style={{ 
                        background: board.background,
                        backgroundImage: board.pattern,
                        backgroundSize: board.id === 'grid' ? '20px 20px' : 
                                        board.id === 'dotted' ? '20px 20px' : 
                                        board.id === 'lined' ? '100% 20px' : '20px 20px'
                      }}
                    />
                    <span className="font-medium">{board.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
            isExpanded 
              ? 'bg-gray-100 dark:bg-gray-800' 
              : 'bg-white dark:bg-gray-800'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.95 }}
          aria-label="Select board style"
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <line x1="3" x2="21" y1="9" y2="9"></line>
              <line x1="3" x2="21" y1="15" y2="15"></line>
              <line x1="9" x2="9" y1="3" y2="21"></line>
              <line x1="15" x2="15" y1="3" y2="21"></line>
            </svg>
            
            <motion.span 
              className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1,
              }}
            />
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
} 