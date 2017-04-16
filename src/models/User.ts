import Error from './APIError';
import STATUSCODES from '../config/StatusCodes';

import IUser from './interface/IUser';
import Roles from './Roles';

class User implements IUser {


    private email: string;
    private password: string;
    private login: string;
    private created: Date;
    private roles: Roles;
    private picture: string;

    Email(): string {
        return this.email;
    }

    Password() :string {
        return this.password;
    }

    Login() :string {
        return this.login;
    }

    Created() :Date {
        return this.created;
    }
   
    Roles(): Roles {
        return this.roles;
    }

    Picture(): string {
        return this.picture;
    }


    constructor(_login: string, _password: string,  _isAuth: boolean = false, _email?: string, _roles?: Roles, _picture? : string ){
        this.setLogin(_login);
        this.setPassword(_password);

        if (!_isAuth) {
            this.setEmail(_email);
            this.setRoles(_roles);
            this.picture = _picture;
        }       
    }

    private setEmail(_email: string) :void {
        if (_email == "" || _email == null) {
            throw new Error(STATUSCODES.BAD_REQUEST, "L'email ne doit pas être vide.");
        }
        this.email = _email;
    }

    private setLogin(_login: string) :void {
        if (_login == "" || _login == null) {
            throw new Error(STATUSCODES.BAD_REQUEST, "Le login ne doit pas être vide.");
        }
        this.login = _login;
    }

    private setPassword(_password: string) :void {
        if (_password == "" || _password == null) {
            throw new Error(STATUSCODES.BAD_REQUEST, "Le mot de passe ne doit pas être vide.");
        } 
        if (_password.length < 7) {
            console.log(STATUSCODES.BAD_REQUEST);
             throw new Error(STATUSCODES.BAD_REQUEST, "Votre mot de passe doit contenir un minimum de 8 caractères.");
        }
        this.password = _password;
    }

    private setRoles(_roles: Roles) :void {
        this.roles = _roles == null? Roles.USER : _roles;       
    }
}

export default User;