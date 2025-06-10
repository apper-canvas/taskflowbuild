import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const ErrorState = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="mb-6"
      >
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto" />
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-md mx-auto">
        {message || 'We encountered an error while loading your tasks. Please try again.'}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 mx-auto"
        >
          <ApperIcon name="RefreshCw" className="w-5 h-5" />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorState;