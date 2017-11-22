export class Error {
    message: string;
    display: boolean;

    show(msg) {
        this.display = true;
        this.message = msg ? msg : 'An unknown error has occurred. Please try again.';
    }
}