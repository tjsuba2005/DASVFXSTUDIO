// src/components/ErrorBoundary.jsx

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  /**
   * This lifecycle method is used to render a fallback UI after an error has been thrown.
   * It is called during the "render" phase, so side-effects are not permitted.
   * For side-effects, use componentDidCatch().
   * 
   * @param {Error} error The error that was thrown.
   * @returns {object} A state object to update the state.
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * This lifecycle method is called after an error has been thrown by a descendant component.
   * It receives two parameters: the error and information about which component threw the error.
   * It is called during the "commit" phase, so side-effects (like logging) are allowed.
   *
   * @param {Error} error The error that was thrown.
   * @param {object} errorInfo An object with a componentStack key.
   */
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // For example: logErrorToMyService(error, errorInfo);
    console.error("Uncaught error:", error, errorInfo);
    
    // You can also update state here if you need to store the specific error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // This can be a simple message or a complex component.
      // You can even pass a fallback component as a prop for more reusability.
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div style={{ padding: '20px', border: '1px solid red', margin: '10px' }}>
          <h2>Something went wrong.</h2>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          {/* Optionally, display error details during development */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    // If there's no error, render the children as normal.
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default ErrorBoundary;