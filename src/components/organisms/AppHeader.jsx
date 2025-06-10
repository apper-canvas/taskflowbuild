import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import ProgressCircle from '@/components/molecules/ProgressCircle';

const AppHeader = ({ 
    completedToday, 
    totalToday, 
    progressPercentage, 
    filters, 
    onFiltersChange, 
    onQuickAddToggle 
}) => {
    return (
        <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-6 flex items-center justify-between z-40">
            <div className="flex items-center space-x-4">
                <Heading level="h1" className="text-xl font-bold">TaskFlow Pro</Heading>
                <div className="flex items-center space-x-2">
                    <ProgressCircle percentage={progressPercentage} />
                    <div className="text-sm text-gray-600">
                        {completedToday} of {totalToday} completed today
                    </div>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.searchQuery}
                        onChange={(e) => onFiltersChange(prev => ({...prev, searchQuery: e.target.value}))}
                        className="w-80 pl-10 pr-4 py-2"
                    />
                    <ApperIcon name="Search" className="absolute left-3 top-2.5 w-5 h-5 text-surface-400" />
                </div>
                <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onQuickAddToggle}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                >
                    <ApperIcon name="Plus" className="w-5 h-5" />
                    <span>Quick Add</span>
                </Button>
            </div>
        </header>
    );
};

export default AppHeader;