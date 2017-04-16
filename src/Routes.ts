import * as express from "express";

// import sub-routers
import HeroRouter from './routes/HeroRouter';
import LoginRouter from './routes/LoginRouter';
import RegisterRouter from './routes/RegisterRouter';

class Routes {
    // ref to Express instance
    public router: express.Router;

    constructor(){
        this.router = express.Router();
        this.routes();
    }

    // Configure API endpoints.
    private routes(): void {

    let router = express.Router();

    // placeholder route handler
    router.get('/', (req, res, next) => {
        res.json({
        message: 'Hello World!'
        });
    });


    this.router.use('/', router);
    this.router.use('/api/', LoginRouter);
    this.router.use('/api/', RegisterRouter);
    this.router.use('/api/heroes', HeroRouter);
    };
}

export default new Routes().router;