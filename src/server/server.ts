import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

declare var __dirname;

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add api
    this.api();

    this.app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../client', 'index.html'));
    });
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    var router = express.Router();

    router.get('/', function(req, res) {
        res.json({ message: 'Welcome to our api!' });
    });

    this.app.use('/api', router);
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    var app = this.app;

    app.use('/node_modules', express.static('node_modules'));
    app.use('/', express.static('dist/client'));

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //use cookie parker middleware middlware
    app.use(cookieParser("SECRET_GOES_HERE"));

    //use override middlware
    app.use(methodOverride());

    //catch 404 and forward to error handler
    app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    app.use(errorHandler());
  }
}
