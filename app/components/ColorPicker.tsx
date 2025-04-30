import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  isBackgroundPicker?: boolean;
}

// Predefined colors
const defaultColors = [
  '#000000', // Black
  '#3E3E3E', // Dark Gray
  '#FF0000', // Red
  '#FF6B00', // Orange
  '#FFCC00', // Yellow
  '#8FBC8F', // Green
  '#1E90FF', // Blue
  '#673AB7', // Deep Purple
  '#F06292', // Pink
  '#795548', // Brown
];

// Background colors
const backgroundColors = [
  '#FFFFFF', // White
  '#F5F5F5', // Off White
  '#FAFAFA', // Light Gray
  '#F0F8FF', // Alice Blue
  '#FFF8E1', // Light Yellow
  '#F1F8E9', // Light Green
  '#E3F2FD', // Light Blue
  '#F3E5F5', // Light Purple
  '#FFF0F0', // Light Pink
  '#EFEBE9', // Light Brown
];

export default function ColorPicker({ color, onColorChange, isBackgroundPicker = false }: ColorPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const colors = isBackgroundPicker ? backgroundColors : defaultColors;
  const pickerTitle = isBackgroundPicker ? 'Background Color' : 'Drawing Color';
  const buttonPosition = isBackgroundPicker ? 'top-24 right-24' : 'bottom-6 left-6';

  return (
    <motion.div 
      className={`absolute ${buttonPosition} z-10`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: isBackgroundPicker ? 0.3 : 0.1
      }}
    >
      <motion.div 
        className="flex flex-col items-center"
        animate={{ gap: isExpanded ? '0.75rem' : '0rem' }}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="bg-white/90 backdrop-blur-md dark:bg-gray-800/90 p-4 rounded-2xl shadow-xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{pickerTitle}</h3>
              
              <div className="mb-4">
                <HexColorPicker 
                  color={color} 
                  onChange={onColorChange}
                  style={{ width: '100%', height: '160px' }}
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {colors.map((colorOption) => (
                  <motion.button
                    key={colorOption}
                    className={`w-10 h-10 rounded-full transition-shadow ${
                      color === colorOption ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' : ''
                    }`}
                    style={{ backgroundColor: colorOption }}
                    onClick={() => onColorChange(colorOption)}
                    aria-label={`Select color ${colorOption}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
          style={{ 
            backgroundColor: isExpanded ? 'white' : color,
            borderWidth: 3,
            borderColor: isExpanded ? color : 'transparent'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle color picker"
        >
          {isExpanded ? (
            <motion.div
              animate={{ rotate: 45 }}
              className="text-gray-700 dark:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </motion.div>
          ) : isBackgroundPicker ? (
            <motion.div className="text-gray-700 dark:text-gray-300" style={{ color: getContrastColor(color) }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M3 3h18v18H3z"></path>
              </svg>
            </motion.div>
          ) : (
            <motion.div className="text-gray-700 dark:text-gray-300" style={{ color: getContrastColor(color) }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 2v8.4"></path>
                <path d="M18.4 6.59 13.4 13"></path>
                <path d="m8.42 7.7 4.14 6.31"></path>
                <path d="M2 17.6 12 22v-8.4"></path>
                <path d="M22 17.6 12 22"></path>
              </svg>
            </motion.div>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Helper function to determine whether to use white or black text on a color background
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  
  // Calculate luminance using the formula: 0.299r + 0.587g + 0.114b
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
} 