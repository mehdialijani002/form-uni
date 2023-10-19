import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className="text-center mt-5">
          مشکل در سرور لطفا صفحه را رفرش کنید
        </h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
