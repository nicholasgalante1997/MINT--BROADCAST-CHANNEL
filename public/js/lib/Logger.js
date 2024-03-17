class Logger {
    colors = {
        info: "#023e8a",
        warn: "#e9c46a",
        success: "#2a9d8f",
        error: "#e63946"
    }

    info = (message) => {
        if (typeof message === "object" || typeof message === "function") {
            console.log(message);
        } else {
            console.log('%c[INFO]: ' + `%c${message}`, `color: ${this.info}; font-weight: bold;`, 'font-weight: bold;');
        }
    }

    warn = (message) => {
        if (typeof message === "object" || typeof message === "function") {
            console.warn(message);
        } else {
            console.warn('%c[WARN]: ' + `%c${message}`, `color: ${this.warn}; font-weight: bold;`, 'font-weight: bold;');
        }
    }

    error = (message) => {
        if (typeof message === "object" || typeof message === "function") {
            console.error(message);
        } else {
            console.error('%c[ERROR]: ' + `%c${message}`, `color: ${this.error}; font-weight: bold;`, 'font-weight: bold;');
        }
    }

    success = (message) => {
        if (typeof message === "object" || typeof message === "function") {
            console.info(message);
        } else {
            console.info('%c[SUCCESS]: ' + `%c${message}`, `color: ${this.success}; font-weight: bold;`, 'font-weight: bold;');
        }
    }
}

export default new Logger();