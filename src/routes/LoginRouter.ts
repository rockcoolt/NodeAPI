import { Router, Request, Response, NextFunction } from 'express';

//Controllers
import LoginController from '../controllers/LoginControllers';

//API Config
const API = require('../config/api.config');
import STATUSCODES from '../config/StatusCodes';


export class LoginRouter {
    
    public router: Router

    /**
     *  Initialize LoginRouter
     */
     constructor() {
         this.router = Router();
         this.init();
     }

     /**
      * Login 
      * @param req 
      * @param res 
      * @param next 
      */
     public login(req: Request, res: Response, next: NextFunction): void {
        var ip = req.headers['x-real-ip'];
        try {
            let obj = new LoginController().authenticate(req.body.login, req.body.password, ip).subscribe({
                next: token => {   
                    // set cookie              
                    // return the information including token as JSON        
                    res.cookie(API.cookieKey, req.body.login)
                    .status(STATUSCODES.OK).send({ 
                        success: true,
                        message: "Vous êtes connecté.",
                        token: token,
                        ip: ip
                    });  
                },
                error: error => {
                
                    res.status(error.code).send({ 
                        success: false,
                        message: error.message
                    });
                },
                complete: () => console.log('done'),
            });

           
        } catch (error) {
            res.status(error.code).send({ 
                success: false,
                message: error.message
            });          
        }
     }

     /**
      * Logout
      * @param req 
      * @param res 
      * @param next 
      */
     public logout(req: Request, res: Response, next: NextFunction): void {
         var ip = req.headers['x-real-ip'];
         try {
            new LoginController().logout(ip).subscribe({
                 next: reponse => {
                    res.status(STATUSCODES.OK).send({ 
                        success: true,
                        message: "Vous êtes déconnecté.",
                    });   
                 },
                 error: error => {                
                    res.status(error.code).send({ 
                        success: false,
                        message: error.message
                    });
                },
            });
         } catch (error) {
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
        this.router.post('/login', this.login);
        this.router.get('/logout', this.logout);
     }

}

const loginRoutes = new LoginRouter();
loginRoutes.init();

export default loginRoutes.router;