import React from 'react';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Welcome to the Next.js RBAC App</h1>
            <p className="mt-4 text-lg">This application demonstrates role-based access control using Next.js.</p>
            <div className="mt-6">
                <a href="/login" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Login
                </a>
            </div>
        </div>
    );
};

export default HomePage;