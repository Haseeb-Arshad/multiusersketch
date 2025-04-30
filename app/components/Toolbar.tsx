import React, { useState } from 'react';
import { FaPencilAlt, FaPaintBrush, FaPen, FaHighlighter } from 'react-icons/fa';
import { DrawingTool, BoardStyle } from '../utils/types';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { BsFillGrid3X3GapFill, BsSquare } from 'react-icons/bs';
import { TfiRulerPencil } from 'react-icons/tfi';
import { LuFileOutput } from 'react-icons/lu';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiSolidEraser } from 'react-icons/bi';

// Tool icons mapping
const TOOL_ICONS = {
  pencil: <FaPencilAlt />,
  marker: <FaHighlighter />,
  pen: <FaPen />,
  brush: <FaPaintBrush />,
  eraser: <BiSolidEraser />
};

// Board style icons
const BOARD_ICONS = {
  blank: <BsSquare />,
  grid: <BsFillGrid3X3GapFill />,
  lined: <TfiRulerPencil />,
  dotted: <LuFileOutput />
};

// Available colors
const COLORS = [
  '#000000', // Black
  '#333333', // Dark gray
  '#666666', // Gray
  '#999999', // Light gray
  '#ffffff', // White
  '#ff0000', // Red
  '#ff9900', // Orange
  '#ffff00', // Yellow
  '#00ff00', // Green
  '#00ffff', // Cyan
  '#0000ff', // Blue
  '#9900ff', // Purple
  '#ff00ff', // Magenta
  '#ff9999', // Light red
  '#ffcc99', // Light orange
  '#ffff99', // Light yellow
  '#99ff99', // Light green
  '#99ffff', // Light blue
  '#9999ff', // Light purple
  '#ff99ff', // Light pink
];

// Available backgrounds
const BACKGROUNDS = [
  '#ffffff', // White
  '#f8f9fa', // Light gray
  '#f5f5f0', // Off-white
  '#fffaf0', // Floral white
  '#f0f8ff', // Alice blue
  '#f0fff0', // Honeydew
  '#fff0f5', // Lavender blush
  '#f0ffff', // Azure
  '#fffacd', // Lemon chiffon
  '#e6f7ff', // Light blue
];

// Line width options
const LINE_WIDTH_OPTIONS = [1, 2, 3, 5, 8, 12, 16, 20];

// Define prop types for the Toolbar component
interface ToolbarProps {
  selectedTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  lineWidth: number;
  onLineWidthChange: (width: number) => void;
  boardStyle: string;
  onBoardStyleChange: (style: string) => void;
  onClear: () => void;
  onSave: () => void;
  onNewBoard: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onToolChange,
  selectedColor,
  onColorChange,
  lineWidth,
  onLineWidthChange,
  boardStyle,
  onBoardStyleChange,
  onClear,
  onSave,
  onNewBoard
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showBoardStylePicker, setShowBoardStylePicker] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-50">
      {/* Main toolbar container with frosted glass effect */}
      <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1">
          {/* Drawing Tools Section */}
          <div className="flex space-x-1 mr-3">
            {Object.entries(TOOL_ICONS).map(([tool, icon]) => (
              <button
                key={tool}
                onClick={() => onToolChange(tool as DrawingTool)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  selectedTool === tool
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-md scale-110'
                    : 'bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
                title={tool.charAt(0).toUpperCase() + tool.slice(1)}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          {/* Color Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              title="Select Color"
            >
              <div className="flex items-center">
                <div 
                  className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-500" 
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <IoColorPaletteOutline className="ml-1 text-gray-700 dark:text-gray-300" />
              </div>
            </button>
            
            {/* Color Picker Dropdown */}
            {showColorPicker && (
              <div className="absolute bottom-full left-0 mb-2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 grid grid-cols-5 gap-2 w-60">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onColorChange(color);
                      setShowColorPicker(false);
                    }}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300 dark:border-gray-700'
                    } transition-transform hover:scale-110`}
                    style={{ backgroundColor: color }}
                    title={color}
                  ></button>
                ))}
              </div>
            )}
          </div>

          {/* Line Width Button */}
          <div className="relative">
            <button
              onClick={() => setShowSizePicker(!showSizePicker)}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              title="Line Width"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <div
                  className="rounded-full bg-gray-800 dark:bg-gray-300"
                  style={{
                    width: `${Math.min(24, lineWidth * 2)}px`,
                    height: `${Math.min(24, lineWidth * 2)}px`,
                  }}
                ></div>
              </div>
            </button>
            
            {/* Size Picker Dropdown */}
            {showSizePicker && (
              <div className="absolute bottom-full left-0 mb-2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-60">
                <div className="flex flex-wrap gap-2 justify-center">
                  {LINE_WIDTH_OPTIONS.map((width) => (
                    <button
                      key={width}
                      onClick={() => {
                        onLineWidthChange(width);
                        setShowSizePicker(false);
                      }}
                      className={`flex items-center justify-center ${
                        lineWidth === width ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
                      } rounded-full p-1 transition-transform hover:scale-110`}
                      title={`${width}px`}
                    >
                      <div
                        className="rounded-full bg-gray-800 dark:bg-gray-300"
                        style={{
                          width: `${Math.min(20, width * 2)}px`,
                          height: `${Math.min(20, width * 2)}px`,
                        }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          {/* Board Styles */}
          <div className="relative">
            <button
              onClick={() => setShowBoardStylePicker(!showBoardStylePicker)}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              title="Board Style"
            >
              <div className="flex items-center">
                {BOARD_ICONS[boardStyle as keyof typeof BOARD_ICONS] || BOARD_ICONS.blank}
              </div>
            </button>
            
            {/* Board Style Dropdown */}
            {showBoardStylePicker && (
              <div className="absolute bottom-full left-0 mb-2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-2 w-60">
                {Object.entries(BOARD_ICONS).map(([style, icon]) => (
                  <button
                    key={style}
                    onClick={() => {
                      onBoardStyleChange(style);
                      setShowBoardStylePicker(false);
                    }}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      boardStyle === style 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                        : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300'
                    } transition-all hover:bg-gray-100 dark:hover:bg-gray-600`}
                    title={style.charAt(0).toUpperCase() + style.slice(1)}
                  >
                    <span className="mr-2">{icon}</span>
                    <span className="capitalize">{style}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          {/* Action Buttons */}
          <div className="flex space-x-1">
            {/* Clear Button */}
            <button
              onClick={onClear}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-300 transition-all"
              title="Clear Canvas"
            >
              <RiDeleteBin6Line />
            </button>
            
            {/* Save Button */}
            <button
              onClick={onSave}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-300 transition-all"
              title="Save Canvas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            
            {/* New Board Button */}
            <button
              onClick={onNewBoard}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-300 transition-all"
              title="New Board"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 