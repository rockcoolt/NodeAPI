import { Observable} from 'rxjs/Observable';
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';

//Models
import User from '../models/User';
import Error from '../models/APIError';
import IUser from '../models/interface/IUser';
import Roles from '../models/Roles';

//Config
import STATUSCODES from '../config/StatusCodes';
const API = require('../config/api.config');

//DataAccess
import UserSchema from '../dataAccess/schemas/UserSchema';
import RedisAcces from '../dataAccess/RedisAcces';

export class LoginController {

    /**
     * retun one user if is authenticated
     * @param _login user login
     * @param _password user password
     */
    public authenticate(_login: string, _password: string) {

        //UserSchema.create(new User('test','test857',false,'test@test.com', Roles.ADMIN, 'local/image.jpeg'));
        const self = this;
        let _model = new User(_login, _password, true);
       
        try {

            let observable = Observable.create(function (observer) {
                UserSchema.findOne({ login : _model.Login() , password : _model.Password() })
                .exec()
                .onResolve((err, user) => {
                    if (!user) {
                        observer.error(new Error(STATUSCODES.BAD_REQUEST, "Login ou mot de passe incorrect."));                    
                    }
                    if (user) {
                        // if user is found and password is right
                        // create a token
                        let token = sign(user.toObject(), API.tokenKey, { expiresIn: API.tokeExpiresTime });

                        self.setRedis(observer, token, token);
                        
                        observer.next(token); 
                        observer.complete();                    
                    }
                    if (err) {
                        observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, `Base de donnée erreur: ${err.errmsg}` )); 
                    }             
                });  
            });

            return observable;
            
        } catch (error) {
            throw new Error(STATUSCODES.INTERNAL_SERVER_ERROR, error);         
        }    
    }

    private setRedis(observer: any, token: any, user: any){
        // save token in redis
        RedisAcces.instance.set(token, JSON.stringify(user), function (err, reply) {
            if (err) {
                observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, `Redis erreur: ${err}` )); 
            }

            if (reply) {
                RedisAcces.instance.expire(token, API.tokeExpiresTime_SEC, function (err, reply) {
                    if (err) {
                        observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, 'Can not set the expire value for the token key' )); 
                    }
                    if (reply) {
                        console.log(reply);
                        // next(); // we have succeeded
                    } else {
                         observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, 'Expiration not set on redis' )); 
                    }
                });
            }
            else {
               observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, 'Token not set in redis' )); 
            }
        });
    }
}

export default LoginController;