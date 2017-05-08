import * as redis from 'redis';

const API = require('../config/api.config');

export class RedisAccess {
    static instance: redis;
    
    constructor () {
        RedisAccess.connect();
    }
    
    static connect (): any {
        if(this.instance) return this.instance;
        
        this.instance = redis.createClient(API.RedisPort, API.RedisServer);

        this.instance.on('connect', () => {
            console.log("Connected to Redis.");
        });
        this.instance.on('error', () => {
            console.log("Error in Redis.");
        });

        return this.instance;
    }       
}

RedisAccess.connect();

export default RedisAccess;
     