import React from 'react';

const ProgressCircle = ({ percentage }) => {
    return (
        <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                    fill="none"
                />
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#5B21B6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${percentage * 1.257} 125.7`}
                    className="transition-all duration-300"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
};

export default ProgressCircle;