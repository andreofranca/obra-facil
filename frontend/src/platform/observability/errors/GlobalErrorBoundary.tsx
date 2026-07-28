"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "../logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("Uncaught error in React Error Boundary", {
      module: "GlobalErrorBoundary",
      action: "REACT_RENDER_ERROR",
      errorName: error.name,
      errorMessage: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  private resetBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error, this.resetBoundary);
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 border border-red-500 bg-red-50 text-red-900 rounded-md">
          <h2 className="text-lg font-bold mb-2">Ops! Ocorreu um erro inesperado na interface.</h2>
          <p className="text-sm">{this.state.error.message}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={this.resetBoundary}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
