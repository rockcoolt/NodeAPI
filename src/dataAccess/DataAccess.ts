import * as mongoose from 'mongoose';


const API = require('../config/api.config');

export class DataAccess {
    static mongooseInstance: any;
    static mongooseConnection: mongoose.Connection;
    
    constructor () {
        DataAccess.connect();
    }
    
    static connect (): mongoose.Connection {
        if(this.mongooseInstance) return this.mongooseInstance;
        
        this.mongooseConnection  = mongoose.connection;
        this.mongooseConnection.once("open", () => {
            console.log("Connected to MongoDB.");
        });
        
        this.mongooseInstance = mongoose.connect(API.DB_Connection_String);
        return this.mongooseInstance;
    }       
}

DataAccess.connect();

export default DataAccess;
     