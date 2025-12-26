import React from 'react';
import { Ghost } from 'lucide-react';

const EmptyState = ({ title = "Nothing to see here", message = "Try searching for something else or explore new genres." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 min-h-[40vh]">
            <Ghost size={64} className="mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="max-w-md">{message}</p>
        </div>
    );
};

export default EmptyState;
