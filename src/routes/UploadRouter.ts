import { Router, Request, Response, NextFunction } from 'express';

import { multer } from 'multer';

export class UploadRouter {
    public router: Router
    private upload: any;
       constructor() {
         this.router = Router();
         this.init();
     }

     private initUpload(){
        const storage = multer.diskStorage({ //multers disk storage settings
            destination: function (req, file, cb) {
                cb(null, './uploads/');
            },
            filename: function (req, file, cb) {
                const datetimestamp = Date.now();
                cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
            }
        }); 

        this.upload = multer({ //multer settings
            storage: storage
        }).single('file');

     }

     public doUpload(req: Request, res: Response, next: NextFunction): void {
        this.upload(req, res, function(err){
            console.log(req);
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
     }

       /**
      * Initialize routes
      */
     public init(): void {
        this.router.post('/upload', this.doUpload);
     }

}

const uploadRouter = new UploadRouter();
uploadRouter.init();

export default uploadRouter.router;