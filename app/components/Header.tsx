import { motion } from 'framer-motion';

interface HeaderProps {
  userCount?: number;
  onSave?: () => void;
}

export default function Header({ userCount = 0, onSave }: HeaderProps) {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-10 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
    >
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-blue-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
            />
          </svg>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Sketch Together</h1>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {userCount > 0 && (
            <div className="hidden md:flex items-center space-x-1 text-gray-600 dark:text-gray-300">
              <motion.div 
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                }}
              />
              <span>{userCount} Online User{userCount !== 1 ? 's' : ''}</span>
            </div>
          )}
          
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            disabled={!onSave}
          >
            Save Sketch
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
} 