class NotImplementedError extends Error {
    constructor(msg: string){
        super(msg);
        this.name = "NotImplementedError"
    }
}

export default NotImplementedError;