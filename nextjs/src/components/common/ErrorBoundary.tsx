'use client';

import { Component, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
            minHeight: 200,
            background: 'linear-gradient(145deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.05) 100%)',
            borderRadius: 2,
            border: '1px solid rgba(255,0,0,0.2)',
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button variant="outlined" color="error" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
