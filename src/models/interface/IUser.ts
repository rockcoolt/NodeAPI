import Document from 'mongoose';
import Roles from '../Roles';

export interface IUser extends Document {
    Email(): string;
    Password(): string;
    Login(): string;
    Roles(): Roles;
    Picture() : string;
    Created(): Date;
}

export default IUser;