import { Observable} from 'rxjs/Observable';


//Models
import User from '../models/User';
import Error from '../models/APIError';
import IUser from '../models/interface/IUser';
import Roles from '../models/Roles';

//Config
import STATUSCODES from '../config/StatusCodes';

//DataAccess
import UserSchema from '../dataAccess/schemas/UserSchema';

import * as session from 'express-session';

export class LoginController {

    /**
     * retun one user if is authenticated
     * @param _login user login
     * @param _password user password
     */
    public authenticate(_login: string, _password: string) {

        //UserSchema.create(new User('test','test857',false,'test@test.com', Roles.ADMIN, 'local/image.jpeg'));

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
                        observer.next(user); 
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
}

export default LoginController;