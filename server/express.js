import express from 'express' 
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from '../server/template.js'
import userRoutes from './Routes/user.routes.js'
import authRoutes from './Routes/auth.routes.js'
import recipeRoutes from './Routes/recipe.routes.js'
import contactRoutes from './Routes/contact.routes.js'
import path from "path";

    const port = process.env.PORT || 3000;
    const app = express()
    const CURRENT_WORKING_DIR = process.cwd();
    const corsOptions = {
        origin: ['https://freshplate-milb.onrender.com', 'http://localhost:3000'],
        method: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        optionsSuccessStatus: 204
      }
      

   // Serve static files from the build directory
   app.use(express.static(path.join(CURRENT_WORKING_DIR, "../dist/app")))
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use('/', userRoutes)
   app.use('/', authRoutes)
   app.use('/', recipeRoutes)
   app.use('/', contactRoutes)
   app.use(bodyParser.json())
   app.use(bodyParser.urlencoded({ extended: true }))
   app.use(cookieParser())
   app.use(compress())
   app.use(helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
          workerSrc: ["'self'", "blob:"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'", "https://freshplate-milb.onrender.com"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          fontSrc: ["'self'", "data:"],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
  }))
   app.use(cors(corsOptions))
   app.get('/', (req, res) => {
    res.status(200).send(Template()) 
    }) 
    // Catch-all route to serve the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(CURRENT_WORKING_DIR, '../dist/app/index.html'))
    })
    
    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message}) 
        }else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message}) 
        console.log(err)
        } 
        })
          
   export default app
