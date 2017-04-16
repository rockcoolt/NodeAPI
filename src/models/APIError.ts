export class APIError extends Error {

    public code: number;


   constructor(code: number, message: string) {
        super(message);

        this.code = code;
        
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, APIError.prototype);
    }   
}

export default APIError;