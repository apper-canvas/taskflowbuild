import React from 'react';

const priorityColors = {
    High: 'bg-accent text-white',
    Medium: 'bg-secondary text-white',
    Low: 'bg-surface-300 text-surface-700'
};

const PriorityBadge = ({ priority, className = '' }) => {
    const colorClass = priorityColors[priority] || 'bg-surface-300 text-surface-700';
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
            {priority}
        </span>
    );
};

export default PriorityBadge;