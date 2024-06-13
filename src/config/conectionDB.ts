import mongoose from "mongoose";

const handleConectionDB = ()=>{
    const URI = <string> process.env.DB_URI
    mongoose.set('strictQuery', false);
    mongoose.connect(URI)
    .then(()=>console.log("Conetado..."))
    .catch((error)=>console.log('Falló la conexión ' + error))
}


export default handleConectionDB