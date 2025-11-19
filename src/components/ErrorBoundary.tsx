import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d0a1d] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1a1a2e] border border-red-500/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              ⚠️ Algo salió mal
            </h2>
            <p className="text-gray-300 mb-4">
              La aplicación encontró un error inesperado.
            </p>
            {this.state.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4">
                <p className="text-sm text-red-300 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full btn-neon"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
