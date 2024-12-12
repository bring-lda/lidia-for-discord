const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs');
        this.logFile = path.join(this.logDir, `log-${new Date().toISOString().split('T')[0]}.log`);

        // Criar diretório de logs se não existir
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    _formatTimestamp() {
        const now = new Date();
        return now.toISOString().replace('T', ' ').slice(0, 19); // "YYYY-MM-DD HH:MM:SS"
    }

    _writeLog(level, message, data = null) {
        const timestamp = this._formatTimestamp();
        let logMessage = `[${timestamp}] [${level}] ${message}`;

        if (data) {
            logMessage += ` | Data: ${JSON.stringify(data)}`;
        }

        logMessage += '\n';

        // Escrever no arquivo e exibir no console
        fs.appendFileSync(this.logFile, logMessage);
        console.log(logMessage);
    }

    info(message, data = null) {
        this._writeLog('INFO', message, data);
    }

    warn(message, data = null) {
        this._writeLog('WARN', message, data);
    }

    error(message, error = null) {
        const errorMessage = error ? `${error.message} | Stack: ${error.stack}` : null;
        this._writeLog('ERROR', message, errorMessage);
    }

    debug(message, data = null) {
        if (process.env.DEBUG === 'true') {
            this._writeLog('DEBUG', message, data);
        }
    }
}

module.exports = new Logger();
