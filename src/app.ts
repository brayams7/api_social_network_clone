//Config para que nuestro proyecto empiece aplicar la configuración de las variables de entorno.
import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { router } from "./routes"
import handleConectionDB from "./config/conectionDB"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import {join} from 'path'

const PORT = process.env.PORT || 3001 


const app = express()
console.log(join(__dirname,"../uploads"))
//MIDDLEWARE
app.use(cors({
    origin:['http://localhost:3000']
})) //config de los cors
app.use(morgan('dev'))
app.use(cookieParser())

app.use(bodyParser.urlencoded({limit:"10mb",extended: true}))

app.use(express.json())

app.use("/public", express.static(join(__dirname,"../uploads")))

app.use(router)

handleConectionDB()

app.listen(PORT, ()=>console.log('Listo por el puerto ' + PORT))