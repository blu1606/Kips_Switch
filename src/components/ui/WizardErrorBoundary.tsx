'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class WizardErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[WizardErrorBoundary] Caught error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-dark-800 rounded-2xl border border-red-500/20 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <span className="text-3xl">⚠️</span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">
                        Something went wrong
                    </h2>

                    <p className="text-dark-400 max-w-md mb-6">
                        The wizard encountered an unexpected error. Your data has not been lost, but the current step needs to be reset.
                    </p>

                    {this.state.error && (
                        <div className="bg-black/30 p-3 rounded-lg text-xs text-red-400 font-mono mb-6 max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
                            {this.state.error.message}
                        </div>
                    )}

                    <button
                        onClick={this.handleRetry}
                        className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all font-medium border border-dark-600 hover:border-dark-500"
                    >
                        ↻ Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
