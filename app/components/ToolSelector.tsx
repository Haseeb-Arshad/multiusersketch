import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type DrawingTool = 'pencil' | 'marker' | 'pen' | 'brush' | 'eraser';

interface ToolSelectorProps {
  currentTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
}

interface Tool {
  id: DrawingTool;
  name: string;
  icon: React.ReactNode;
}

export default function ToolSelector({ currentTool, onToolChange }: ToolSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tools: Tool[] = [
    {
      id: 'pencil',
      name: 'Pencil',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
        </svg>
      )
    },
    {
      id: 'marker',
      name: 'Marker',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="m20 8-8-4-12 6 8 4Z"></path>
          <path d="m8 16 4 2v4"></path>
          <path d="M12 18v-5.5"></path>
          <path d="M4 10v4.5a8 8 0 0 0 8 8 8 8 0 0 0 8-8V10"></path>
        </svg>
      )
    },
    {
      id: 'pen',
      name: 'Pen',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <path d="M11 11l2 2"></path>
        </svg>
      )
    },
    {
      id: 'brush',
      name: 'Brush',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M18 8c0 2-2 2-2 4v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1v-10c0-2-2-2-2-4V5h12zM14 5h-4V3h4z"></path>
        </svg>
      )
    },
    {
      id: 'eraser',
      name: 'Eraser',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
          <path d="M22 21H7"></path>
          <path d="m5 11 9 9"></path>
        </svg>
      )
    }
  ];

  const getCurrentTool = () => tools.find(tool => tool.id === currentTool) || tools[0];

  return (
    <motion.div
      className="absolute top-24 left-6 z-10"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.3
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
              <div className="p-2">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    className={`flex items-center w-full px-4 py-3 rounded-xl mb-1 last:mb-0 ${
                      currentTool === tool.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => {
                      onToolChange(tool.id);
                      setIsExpanded(false);
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-3">{tool.icon}</span>
                    <span className="font-medium">{tool.name}</span>
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
          aria-label="Select drawing tool"
        >
          <div className="relative">
            {getCurrentTool().icon}
            
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