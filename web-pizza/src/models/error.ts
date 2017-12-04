/** Instanciates an object type Error */
export class Error {
    /** Error message */
    message: string;
    /** Should display error message */
    display: boolean;

    /** Displays an error box with custom message */
    show(msg) {
        this.display = true;
        this.message = msg ? msg : 'An unknown error has occurred. Please try again.';
    }
}