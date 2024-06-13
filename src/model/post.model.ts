import mongoose, { Schema, model, Model, Types} from "mongoose";
import { PostInterface, PostInterfaceTimeLine } from "../interfaces/posts/post.interface";
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Es Squema: es la representación de las propiedas que se van
 * a guardar en la base de datos.
 */

// interface IPostModelMethods extends Model<PostInterface> {
  
// }

// type PostModelo = Model<PostInterface, {}, IPostModelMethods>;

const PostSchema = new Schema(
  {
    userId:{
      type:String,
      required:true
    },
    desc:{
      type:String,
      required:false,
      default:''
    },
    likes:[
      {
        idUser:{
          type:Types.ObjectId
        },
        username: {
          type:String
        },
        profilePicture:{
          type:String
        },
        followers:[],
        following:[]
      }
    ],
    image:{
      type:String,
      required:false,
      default:''
    },
    createdAt:Date,
    updateAt:Date
  },
  {
    timestamps: true,
  }
)

PostSchema.plugin(paginate)
PostSchema.plugin(aggregatePaginate)
// interface InstitutionDocument extends mongoose.Document, PostModelo {}


/**
 * El model: es el nombre de la colección
 */
const PostModel = model<PostInterface, mongoose.PaginateModel<PostInterface>>("posts", PostSchema);

//Model timeLine posts
export const PostModelTimeLine = model<PostInterfaceTimeLine, mongoose.PaginateModel<PostInterfaceTimeLine>>("posts", PostSchema);


export const PostModelAggregate = model<PostInterface, mongoose.AggregatePaginateModel<PostInterface>>("posts", PostSchema);

export default PostModel;
