import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, colorize } = format;

// Define your log format
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Create a logger instance
const Logger = createLogger({
  level: 'info',
  format: combine(
    colorize(), // Apply colors
    label({ label: 'BLOG' }),
    timestamp(),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' }),
  ],
});

export default Logger;
