import React from 'react';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const DateBadge = ({ dueDate, completed, className = '' }) => {
    if (!dueDate) return null;

    const parsedDate = parseISO(dueDate);
    const overdue = isPast(parsedDate) && !completed && !isToday(parsedDate);
    const dueToday = isToday(parsedDate);

    const colorClass = overdue ? 'text-error' : dueToday ? 'text-accent' : 'text-surface-600';

    return (
        <div className={`flex items-center space-x-1 text-sm ${colorClass} ${className}`}>
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>
                {isToday(parsedDate)
                    ? 'Today'
                    : format(parsedDate, 'MMM d')
                }
            </span>
        </div>
    );
};

export default DateBadge;