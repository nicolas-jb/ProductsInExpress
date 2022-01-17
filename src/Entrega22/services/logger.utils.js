import log4js from "log4js";


log4js.configure({
    appenders: {
      miConsoleLogger: { type: "console" },
      miErrorFileLogger: { type: "file", filename: "error.log" },
      miWarningFileLogger: { type: "file", filename: "warn.log" },
    },
    categories: {
      default: { appenders: ["miConsoleLogger"], level: "info" },
      errorFile: { appenders: ["miErrorFileLogger"], level: "error" },
      warnFile: { appenders: ["miWarningFileLogger"], level: "warn" },
    },
  });

  export default log4js