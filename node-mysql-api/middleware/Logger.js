import winston from "winston";
import expressWinston from "express-winston";

const Logger = () => {
  return expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-mm-DD hh:mm:ss" }),
      winston.format.simple()
    ),
    meta: false,
    msg: " {{req.method}} {{res.statusCode}}  {{res.responseTime}}ms {{req.url}} ",
  });
};

export default Logger;
