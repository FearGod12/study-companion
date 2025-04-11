import { Component } from "react";
import PropTypes from "prop-types";
import Button from "./common/Button";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen flex flex-col items-center justify-center">
                    <h1 className="text-lg font-bold">Something went wrong.</h1>
                    <p className="font-semibold mt-2">{this.state.error?.toString()}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4 text-gray-100"
                    text= 'Refresh Page'
                    />
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired, 
};

export default ErrorBoundary;
