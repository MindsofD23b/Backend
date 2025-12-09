export class Logger {
    public static debugEnabled: boolean;

    private static timestamp() {
        return new Date().toISOString();
    }

    static debug(message: string) {
        if (!this.debugEnabled) return;
        console.log(`\x1b[35m[debug]\x1b[0m ${this.timestamp()} - ${message}`);
    }

    static log(message: string) {
        if (!this.debugEnabled) return;
        console.log(`[log] ${this.timestamp()} - ${message}`);
    }

    static success(message: string) {
        if (!this.debugEnabled) return;
        console.log(`\x1b[32m[success]\x1b[0m ${this.timestamp()} - ${message}`);
    }

    static info(message: string) {
        if (!this.debugEnabled) return;
        console.log(`\x1b[36m[info]\x1b[0m ${this.timestamp()} - ${message}`);
    }

    static warn(message: string) {
        if (!this.debugEnabled) return;
        console.warn(`\x1b[33m[warn]\x1b[0m ${this.timestamp()} - ${message}`);
    }

    static error(message: string, throwErr = false) {
        if (!this.debugEnabled) return;
        console.error(`\x1b[31m[error]\x1b[0m ${this.timestamp()} - ${message}`);
        if (throwErr) throw new Error(message);
    }
}
