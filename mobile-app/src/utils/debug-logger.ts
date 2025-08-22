import { Platform } from 'react-native';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  extra?: any;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private isDebug = process.env.EXPO_PUBLIC_DEBUG === 'true';

  log(level: LogEntry['level'], message: string, extra?: any) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      extra,
    };

    // Store in memory
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Console output in debug mode
    if (this.isDebug) {
      const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      consoleMethod(`[${level.toUpperCase()}] ${message}`, extra || '');
    }

    // Send to remote service if configured
    if (level === 'error' && process.env.EXPO_PUBLIC_SENTRY_DSN) {
      // Sentry will be configured in error boundary
      this.sendToSentry(message, extra);
    }
  }

  info(message: string, extra?: any) {
    this.log('info', message, extra);
  }

  warn(message: string, extra?: any) {
    this.log('warn', message, extra);
  }

  error(message: string, extra?: any) {
    this.log('error', message, extra);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  private sendToSentry(message: string, extra?: any) {
    // This will be handled by Sentry integration
    // Just a placeholder for now
  }

  // Export logs as text for sharing
  exportLogs(): string {
    return this.logs
      .map(log => {
        const time = log.timestamp.toISOString();
        const extras = log.extra ? JSON.stringify(log.extra, null, 2) : '';
        return `[${time}] [${log.level.toUpperCase()}] ${log.message} ${extras}`;
      })
      .join('\n');
  }
}

export const logger = new DebugLogger();

// Global error handler
export const setupGlobalErrorHandler = () => {
  const originalHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    logger.error(`${isFatal ? 'Fatal' : 'Non-fatal'} Error`, {
      message: error.message,
      stack: error.stack,
      isFatal,
      platform: Platform.OS,
    });
    
    // Call original handler
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
};

// Promise rejection handler
export const setupUnhandledRejectionHandler = () => {
  const tracking = require('promise/setimmediate/rejection-tracking');
  
  tracking.enable({
    allRejections: true,
    onUnhandled: (id: string, error: Error) => {
      logger.error('Unhandled Promise Rejection', {
        id,
        message: error.message,
        stack: error.stack,
      });
    },
  });
};