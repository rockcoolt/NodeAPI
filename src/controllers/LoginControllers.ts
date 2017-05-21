import { Observable } from 'rxjs/Observable';
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

import Captcha from '../services/captcha';
import * as request from 'request';
export class LoginController {

    /**
     * retun one user if is authenticated
     * @param _login user login
     * @param _password user password
     */
    public authenticate(_login: string, _password: string, _captcha: string ,_ip: string): Observable<any> {

        //UserSchema.create(new User('test','test857',false,'test@test.com', Roles.ADMIN, 'local/image.jpeg'));
        const self = this;
        let _model = new User(_login, _password, true);
       
        try {

            let observable = Observable.create(function (observer) {
                    Captcha.verifyRecaptcha(_captcha, _ip).subscribe({
                        next: reponse => {
                            if (reponse) {
                                UserSchema.findOne({ login : _model.Login() , password : _model.Password() })
                                    .exec()
                                    .onResolve((err, user) => {
                                        if (!user) {
                                            observer.error(new Error(STATUSCODES.BAD_REQUEST, "Login ou mot de passe incorrect."));                    
                                        }
                                        if (user) {
                                            // if user is found and password is right
                                            // create a token
                                            const uAuth = {
                                                login: user.login, 
                                                email: user.email,
                                                role: user.role,
                                                avatar: user.avatar,
                                                ip: _ip
                                            }
                                            let token = sign(uAuth, API.tokenKey, { expiresIn: API.tokenExpiresTime });
                                            self.setRedis(observer, user.login, token);
                                            
                                            observer.next({token: token, user: uAuth}); 
                                            observer.complete();                    
                                        }
                                        if (err) {
                                            observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, `Base de donnée erreur: ${err.errmsg}.` )); 
                                        }             
                                    }); 
                                
                            } else {
                                 observer.error(new Error(STATUSCODES.BAD_REQUEST, `Votre CAPTCHA n'est pas valide.` )); 
                            }
                        }, 
                        error: error => {
                            observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, `Erreur lors de la vérification du CAPTCHA ${error}.` ));     
                        }
                    });
            });

            return observable;
            
        } catch (error) {
            throw new Error(STATUSCODES.INTERNAL_SERVER_ERROR, error);         
        }    
    }

    private setRedis(observer: any, key: any, token: any){
        // save token in redis
        RedisAcces.instance.set(key, token, function (err, response) {
            if (err) {
                observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, `Redis erreur: ${err}` )); 
            }

            if (response) {
                RedisAcces.instance.expire(key, API.tokenExpiresTime_SEC, function (err, reply) {
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

    public logout(_login: string): Observable<any>{
        let observable = Observable.create(function (observer) {
             RedisAcces.instance.del(_login, function (err, response) {
                if (err) {
                    observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, 'Can not delete the key' )); 
                }
                 if (response) {
                    console.log(response);
                    observer.next(response); 
                } else {
                    observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, `Redis erreur: key not found ${response}` )); 
                }
             })
        });

        return observable;
    }
}

export default LoginController;