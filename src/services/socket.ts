import * as sockets from 'socket.io';
import { verify } from 'jsonwebtoken';
const API = require('../config/api.config');

class Socket {
    public io = sockets.listen();

    constructor(){
        this.connection();
    }

    private connection(): void {
        this.io.sockets.use(function(socket, next) {
            if (socket.handshake.query && socket.handshake.query.token) {
                verify(socket.handshake.query.token, API.tokenKey, function(error, decoded){
                    if(error){
                        console.log('error: ', error);
                        return next(new Error('Authentication error'));
                    }
                    socket.decoded = decoded;
                    next();
                });              
            }
             next(new Error('Authentication error'));
        })
        .on('connection', function(socket) {
            socket.emit('message', `Bienvenu ${socket.decoded.login} !`);
            socket.broadcast.emit('message', `${socket.decoded.login} vient de se connecter !`);
        });
    }
  
}

export default new Socket().io;