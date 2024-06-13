import mongoose, { Schema, model, Model} from "mongoose";
import { User, WorkAt } from "../interfaces/auth.interface";
import { encrypt } from "../utils/bcrypt.handle";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Es Squema: es la representación de las propiedas que se van
 * a guardar en la base de datos.
 */

// interface IUserModel extends Model<User> {
//   findByUsernameOrEmail(username: string, email:string): Promise<User|null>
// }

const UserSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      default:""
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin:{
      type: Boolean,
      default:false,
      required: false,
    },
    profilePicture:{
      type: String,
      default:'',
      required: false,
    },
    coverPicture:{
      type: String,
      default:'',
      required: false,
    },
    detailProfile:{
      about:{
        type: String,
        required:false,
        default:''
      },
      livesIn:{
        type: String,
        required:false,
        default:''
      },
      relationShip:{
        type: String,
        required:false,
        default:''
      },
      workAt:[]
    },
    followers:[String],
    following:[String]
    // contact: {
    //   phone: {
    //     type: String,
    //     require: true,
    //   },
    //   email: {
    //     type: String,
    //     require: false,
    //   },
    // },
  },
  {
    versionKey: false,
    timestamps: true,
    // statics:{
    //   findByUsernameOrEmail(username: string, email:string) {
    //     return this.find({ $or:[{username: username},{email:email}] })
    //   }    
    // }
  }
)

UserSchema.plugin(aggregatePaginate)

// UserSchema.static('findByUsernameOrEmail', function (username: string, email:string) {
//   return this.findOne({ $or:[{username: username},{email:email}] })
//           .then(user=> user)
//           .catch(noExist=>noExist)
// })



/**
 * Middleware: 
 * Son funciones que se ejecutan antes de que se ejecute un evento a nivel
 * de base de datos.
 * */

UserSchema.pre("save", async function(next) {
  if(!this.isModified('password')){
    
    return next()
  }
  try {
    const passHass = await encrypt(this.password)
    this.password = passHass
    next()
  } catch (error) {
    console.log("Error en el hash de contraseña")
    throw new Error("Error en el hash de contraseñas")
  }
})

UserSchema.pre("findOneAndUpdate", function(next) {
  console.log({
    pre:this.getFilter()
  })
  next()
})


/**
 * El model: es el nombre de la colección
 */
const UserModel = model<User>("users", UserSchema);

export const UserModelAggregate = model<User, mongoose.AggregatePaginateModel<User>>("users", UserSchema)


export default UserModel;
