import { LogLevel, type LogEntry } from '@/types/log';

class LogService {
  private static instance: LogService;
  private minLevel: LogLevel;

  private constructor() {
    this.minLevel = import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG;
  }

  static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  private log(level: LogLevel, module: string, message: string, data?: unknown) {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      module,
      data,
    };

    const prefix = `[${LogLevel[level]}] [${entry.timestamp}] [${module}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data ?? '');
        break;
      case LogLevel.INFO:
        console.info(`%c${prefix}`, 'color: #1890ff', message, data ?? '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data ?? '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, data ?? '');
        break;
    }
  }

  debug(module: string, message: string, data?: unknown) {
    this.log(LogLevel.DEBUG, module, message, data);
  }

  info(module: string, message: string, data?: unknown) {
    this.log(LogLevel.INFO, module, message, data);
  }

  warn(module: string, message: string, data?: unknown) {
    this.log(LogLevel.WARN, module, message, data);
  }

  error(module: string, message: string, data?: unknown) {
    this.log(LogLevel.ERROR, module, message, data);
  }
}

export const logger = LogService.getInstance();
