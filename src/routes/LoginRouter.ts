import { Router, Request, Response, NextFunction } from 'express';
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';

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

        try {

            let obj = new LoginController().authenticate(req.body.login, req.body.password).subscribe({
                next: user => {                       
                    // if user is found and password is right
                    // create a token
                    let token = sign(user.toObject(), API.tokenKey, { expiresIn: API.tokeExpiresTime });
                    
                    // return the information including token as JSON        
                    res.status(STATUSCODES.OK).send({ 
                        success: true,
                        message: "Vous êtes connecté.",
                        token: token
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
         res.json({
            success: true,
            message: 'Logout'
        });
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