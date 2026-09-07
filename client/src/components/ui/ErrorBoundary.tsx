import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-primary)]">
            <div className="text-center p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg max-w-md">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Bir şeyler ters gitti</h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Üzgünüz, bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-medium hover:opacity-90 transition-opacity"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
