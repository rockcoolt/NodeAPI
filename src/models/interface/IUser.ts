import Document from 'mongoose';

export interface IUser extends Document {
    Email(): string;
    Password(): string;
    Login(): string;
    Roles(): string;
    Avatar() : string;
    Created(): Date;
}

export default IUser;