import { Observable} from 'rxjs/Observable';

import * as del from 'del';
import * as Loki from 'lokijs';
import * as LokiCollection from 'lokijs';

import Error from '../models/APIError';



//Config
import STATUSCODES from '../config/StatusCodes';
const API = require('../config/api.config');

export class UploadControllers {
    private DB_NAME = 'db.json';
    private COLLECTION_NAME = 'images';
    private db = new Loki(`${API.UploadPath}/${this.DB_NAME}`, { persistenceMethod: 'fs' });

    public upload(file: any): Observable<any> {
        const self = this;
        let observable = Observable.create(function (observer) {
            try {
                self.loadCollection(self.COLLECTION_NAME, self.db).subscribe({
                    next: col => {     
                        console.log(file, 'files'); 
                        console.log( typeof file )    
                        let _data = col.insert(file);
                        self.db.saveDatabase();
                        observer.next(_data);
                    }
                }); 
            }catch (err) {
                observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, err)); 
            }
        });
        return observable;    
    }

    public download(id: any): Observable<any> {
        console.log('id:', id);
        const self = this;
        let observable = Observable.create(function (observer) {
            try {
                self.loadCollection(self.COLLECTION_NAME, self.db).subscribe({
                    next: col => {     
                        const result = col.get(id);
                        if (!result) {
                            observer.error(new Error(STATUSCODES.NOT_FOUND, 'Image non trouvé'));  
                            return;
                        };
                        observer.next(result);
                    }
                }); 
               

               

              
            } catch (err) {
            observer.error(new Error(STATUSCODES.INTERNAL_SERVER_ERROR, err)); 
            }

        });
        return observable;  
    }

    public imageFilter(req, file, cb) {
        // accept image only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error(STATUSCODES.BAD_REQUEST,'Only image files are allowed!'), false);
        }
        cb(null, true);
    };

    private loadCollection(colName, db: Loki): Observable<LokiCollection<any>> {
        let observable = Observable.create(function (observer) {
            db.loadDatabase({}, () => {
                const _collection = db.getCollection(colName) || db.addCollection(colName);
                observer.next(_collection);
            })  
        });
        return observable;
    }
    
}

export default UploadControllers;