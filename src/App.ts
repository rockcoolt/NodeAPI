import * as path          from 'path';
import * as express       from 'express';
import * as logger        from 'morgan';
import * as bodyParser    from 'body-parser';

import Routes             from './Routes';
// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.crossDomain();
    this.middleware();
    this.express.use(Routes);
  }

  private crossDomain(): void {
    this.express.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "http://localhost:4200");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT,DELETE");
      next();
    });
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  };
}

export default new App().express;
