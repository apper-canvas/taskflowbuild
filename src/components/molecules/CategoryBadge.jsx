import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const CategoryBadge = ({ category, className = '' }) => {
    if (!category) return null;

    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            <ApperIcon name={category.icon} className="w-4 h-4 text-surface-500" />
            <span className="text-sm text-surface-600">{category.name}</span>
        </div>
    );
};

export default CategoryBadge;