import { Router, Request, Response, NextFunction } from 'express';

//Controllers
import RegisteController from '../controllers/RegisterControllers';

//Config
import STATUSCODES from '../config/StatusCodes';

export class RegisterRouter {

    public router: Router

    /**
     *  Initialize LoginRouter
     */
     constructor() {
         this.router = Router();
         this.init();
     }

    public register(req: Request, res: Response, next: NextFunction): void {
        try {

            let obj = new RegisteController().registration(req.body.login, req.body.email, req.body.password, req.body.role, req.body.avatar).subscribe({
                next: created => {
                    res.status(STATUSCODES.CREATED).send({ 
                        success: true,
                        message: "Enregistrement effectué."
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
      * Initialize routes
      */
     public init(): void {
        this.router.post('/register', this.register);
     }
}
const registerRoutes = new RegisterRouter();
registerRoutes.init();

export default registerRoutes.router;