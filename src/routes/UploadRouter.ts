import { Router, Request, Response, NextFunction } from 'express';

import * as multer from 'multer'
import * as cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'
import * as Loki from 'lokijs'

//Controllers
import UploadControllers from '../controllers/UploadControllers';

import STATUSCODES from '../config/StatusCodes';
const API = require('../config/api.config');

export class UploadRouter {
    public router: Router
    private _upload = multer({ dest: API.UploadPath, fileFilter: new UploadControllers().imageFilter  });

    constructor() {
        this.router = Router();
        this.init();
    }

    upload(req: Request, res: Response, next: NextFunction): void {
        try {
            console.log(req.body);
            let col = new UploadControllers().upload(req.file).subscribe({
                next: data => {
                    res.status(STATUSCODES.OK).send({ 
                        success: true,
                        message: "Fichier uploadé.",
                        data: { id: data.$loki, fileName: data.filename, originalName: data.originalname },
                    });  
                }
            });
        } catch (error) {
            res.status(error.code).send({ 
                success: false,
                message: error.message
            });
        }
    }

    download(req: Request, res: Response, next: NextFunction): void {
        try {
            let col = new UploadControllers().download(req.params['id']).subscribe({
                next: fichier => {
                    res.setHeader('Content-Type', fichier.mimetype);
                    fs.createReadStream(path.join(API.UploadPath, fichier.filename)).pipe(res); 
                }
            }); 
        }
        catch (error) {
            res.status(error.code).send({ 
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Initialize routes
     */
    public init(): void { 
        this.router.post('/upload', this._upload.single('avatar'), this.upload);
        this.router.get('/downlad/:id', this.download)
    }

}

const uploadRouter = new UploadRouter();
uploadRouter.init();

export default uploadRouter.router;