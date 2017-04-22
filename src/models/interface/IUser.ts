import Document from 'mongoose';
import Roles from '../Roles';

export interface IUser extends Document {
    Email(): string;
    Password(): string;
    Login(): string;
    Roles(): Roles;
    Avatar() : string;
    Created(): Date;
}

export default IUser;