import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "30px", background: "#0f172a", color: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", background: "#1e293b", padding: "24px", borderRadius: "16px", border: "1px solid #ef4444" }}>
            <h2 style={{ color: "#ef4444", marginTop: 0 }}>Application Render Error</h2>
            <p style={{ color: "#94a3b8" }}>The application encountered an unexpected runtime error:</p>
            <pre style={{ background: "#090d16", padding: "16px", borderRadius: "8px", overflowX: "auto", color: "#fca5a5" }}>
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: "16px", padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
