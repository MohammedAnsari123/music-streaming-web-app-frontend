import React from 'react';

const LoadingSkeleton = ({ count = 6, type = 'card' }) => {
    if (type === 'list') {
        return (
            <div className="flex flex-col gap-4 w-full">
                {Array(count).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-md bg-[#181818] animate-pulse">
                        <div className="w-12 h-12 bg-[#282828] rounded"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[#282828] rounded w-1/3"></div>
                            <div className="h-3 bg-[#282828] rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Default: Card
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array(count).fill(0).map((_, i) => (
                <div key={i} className="bg-[#181818] p-4 rounded-lg animate-pulse h-64 flex flex-col">
                    <div className="w-full aspect-square bg-[#282828] rounded-md mb-4"></div>
                    <div className="h-4 bg-[#282828] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[#282828] rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
