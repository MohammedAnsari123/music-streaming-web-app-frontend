import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught Error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-bold mb-4 text-red-500">Something went wrong.</h1>
                    <p className="text-gray-400 mb-6 text-center max-w-md">
                        We're sorry, but the application encountered an unexpected error.
                        Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-full transition"
                    >
                        Refresh Page
                    </button>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mt-8 p-4 bg-gray-900 rounded text-left overflow-auto max-w-2xl w-full border border-gray-800">
                            <p className="text-red-400 font-mono text-sm mb-2">{this.state.error.toString()}</p>
                            <pre className="text-gray-500 font-mono text-xs whitespace-pre-wrap">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
