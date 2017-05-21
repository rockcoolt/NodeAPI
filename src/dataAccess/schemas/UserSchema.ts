import DataAccess from '../DataAccess';
import RedisAcces from '../RedisAcces';
import IUser from '../../models/interface/IUser'
import Roles from '../../models/Roles';

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

export class UserSchema {
    static get schema () {
       var schema =  mongoose.Schema({
           login: {
               type: String,
               required: true,
               unique : true
           },
           email: {
               type: String,
               required: true,
               unique : true
           },
            password: {
               type: String,
               required: true
           },
            role: {
               type: String,
               required: true
           },
            created: {
                type: Date,
                default: Date.now
            },
            avatar: {
                type: String,
                default: null
            }
       });
       
       return schema;
   }  

}

let schema = mongooseConnection.model<IUser>("Users", UserSchema.schema);
export default schema;