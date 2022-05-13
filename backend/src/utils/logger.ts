import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: undefined,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(({ timestamp, level, message, ...args }) => {
      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? `\n${JSON.stringify(args)}` : ''}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
