// frontend/src/components/dashboard/ProgressBar.js
import React from 'react';

const ProgressBar = ({ 
  progress = 0, 
  total = 100, 
  completed = 0, 
  failed = 0, 
  label = '', 
  showStats = true,
  color = 'blue',
  size = 'md'
}) => {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;
  const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const failedPercentage = total > 0 ? Math.round((failed / total) * 100) : 0;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };

  return (
    <div className="w-full">
      {(label || showStats) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showStats && (
            <span className="text-sm text-gray-500">
              {progress} / {total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div className="flex h-full rounded-full overflow-hidden">
          {/* Completed section */}
          {completed > 0 && (
            <div 
              className="bg-green-600 transition-all duration-300 ease-out"
              style={{ width: `${completedPercentage}%` }}
            />
          )}
          
          {/* Failed section */}
          {failed > 0 && (
            <div 
              className="bg-red-600 transition-all duration-300 ease-out"
              style={{ width: `${failedPercentage}%` }}
            />
          )}
          
          {/* Processing section (remaining progress) */}
          {progress > (completed + failed) && (
            <div 
              className={`${colorClasses[color]} transition-all duration-300 ease-out`}
              style={{ width: `${percentage - completedPercentage - failedPercentage}%` }}
            />
          )}
        </div>
      </div>

      {showStats && (completed > 0 || failed > 0) && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
            Completed: {completed}
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-1"></div>
            Failed: {failed}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;