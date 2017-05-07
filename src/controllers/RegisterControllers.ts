import { Observable} from 'rxjs/Observable';

//Models
import User from '../models/User';
import Error from '../models/APIError';
import Roles from '../models/Roles';

//Config
import STATUSCODES from '../config/StatusCodes';

//DataAccess
import UserSchema from '../dataAccess/schemas/UserSchema';

export class RegisterControllers {

    /**
     * registration
     */
    public registration(_login: string, _email: string, _password: string,  _roles?: string, _avatar? : string) {
        let _model = new User(_login, _password, false, _email, _roles, _avatar);

        try {

            let observable = Observable.create(function (observer) {
            UserSchema.create(_model, (err, res) => {
                if (err) {              
                        observer.error(new Error(STATUSCODES.BAD_REQUEST, `Base de donnée erreur: ${err.errmsg}` ));
                    }
                    else {
                        observer.next(); 
                        observer.complete();
                    }
                }); 
            });

            return observable;
            
        } catch (error) {
            throw new Error(STATUSCODES.INTERNAL_SERVER_ERROR, error);         
        }

    }

}

export default RegisterControllers;