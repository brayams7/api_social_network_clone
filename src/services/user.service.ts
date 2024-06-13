import { ResponseClass } from "../class/ResonseClass";
import { DetailProfile, User } from "../interfaces/auth.interface";
import { ResponseInterface } from "../interfaces/response.interface";
import PostModel from "../model/post.model";
import UserModel from "../model/user.model";
import { encrypt } from "../utils/bcrypt.handle";

const getUserService = async (
  id: string | undefined
): Promise<ResponseInterface> => {
  const user = await UserModel.findById(id);

  if (!user) {
    return new ResponseClass(404, {}, "El usuario no existe").getResponseData();
  }
  
  const dataResponse = new ResponseClass(
    200,
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email:user.email,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      createAt: user.createdAt,
      updateAt: user.updateAt,
      username: user.username,
      followers: user.followers,
      following: user.following,
      detailProfile:user.detailProfile
    },
    "OK"
  ).getResponseData();

  return dataResponse;
};

/**
 *
 * @param id
 * @param updateUser
 * @returns
 *
 *
 * Este servicio se encarga de actualizar un usuario de forma
 * general.
 */
const updatedUserService = async (
  id: string | undefined,
  updateUser: Partial<User>
): Promise<ResponseInterface> => {
  if (updateUser.password) {
    const passHass = await encrypt(updateUser.password);
    updateUser.password = passHass;
  }
  try {
    const user = await UserModel.findByIdAndUpdate(id, updateUser, {
      new: true,
    });
    const dataResponse = new ResponseClass(
      200,
      { user },
      "OK"
    ).getResponseData();
    return dataResponse;
  } catch (error) {
    console.log({
      error,
    });
    return new ResponseClass(404, {}, "El usuario no existe").getResponseData();
  }
};

const updatedUserDetailService = async (
  id: string | undefined,
  detailProfile: Partial<DetailProfile>
): Promise<ResponseInterface> => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          detailProfile: detailProfile,
        },
      },
      {
        new: true,
      }
    );
    const dataResponse = new ResponseClass(
      200,
      { user },
      "OK"
    ).getResponseData();
    return dataResponse;
  } catch (error) {
    console.log({
      error,
    });
    return new ResponseClass(404, {}, "El usuario no existe").getResponseData();
  }
};

const deleteUserService = async (id: string | undefined) => {
  try {
    await UserModel.findByIdAndDelete(id);
    return new ResponseClass(
      200,
      {},
      "Usuario eliminado correctamente"
    ).getResponseData();
  } catch (error) {
    console.log(error);
    return new ResponseClass(404, {}, "Ocurrió un error, Intente mas tarde");
  }
};

const followUserService = async (id: string, currentUserId: string) => {
  const responseClass = new ResponseClass(200, {}, "");

  if (currentUserId === id) {
    responseClass.setCode(403);
    responseClass.setMessage("No puedes seguirte a ti mismo");
    return responseClass;
  }

  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(currentUserId);
    const listFollowers: string[] = followUser?.followers || [];

    if (!listFollowers.includes(currentUserId)) {
      await followUser?.updateOne({
        $push: {
          followers: currentUserId,
        },
      });

      await followingUser?.updateOne({
        $push: {
          following: id,
        },
      });

      responseClass.setCode(200);
      responseClass.setMessage("OK");
      return responseClass;
    } else {
      responseClass.setCode(404);
      responseClass.setMessage("El usuario ya es seguido por ti");
      return responseClass;
    }
  } catch (error) {
    console.log(error);
    responseClass.setCode(404);
    responseClass.setMessage("Ocurrió un error, Intente mas tard");
    return responseClass;
  }
};

const unfollowUserService = async (id: string, currentUserId: string) => {
  const responseClass = new ResponseClass(200, {}, "");

  if (currentUserId === id) {
    responseClass.setCode(403);
    responseClass.setMessage("No puedes seguirte a ti mismo");
    return responseClass;
  }

  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(currentUserId);
    const listFollowers: string[] = followUser?.followers || [];

    if (listFollowers.includes(currentUserId)) {
      await followUser?.updateOne({
        $pull: {
          followers: currentUserId,
        },
      });

      await followingUser?.updateOne({
        $pull: {
          following: id,
        },
      });

      responseClass.setCode(200);
      responseClass.setMessage("OK");
      return responseClass;
    } else {
      responseClass.setCode(404);
      responseClass.setMessage("El usuario no te sigue");
      return responseClass;
    }
  } catch (error) {
    console.log(error);
    responseClass.setCode(404);
    responseClass.setMessage("Ocurrió un error, Intente mas tard");
    return responseClass;
  }
};

const getTotalPostsUser = async (idUser: string) => {
  const responseClass = new ResponseClass(200, {}, "");
  try {

    const countPosts = await PostModel.find({
      userId:idUser
    }).count()
    responseClass.setCode(200)
    responseClass.setMessage("OK")
    responseClass.setData({countPosts})

  } catch (error) {
    responseClass.setCode(404);
    responseClass.setMessage("Ocurrió un error, Intente mas tarde");
  }
  // if (!user) {
  //   return new ResponseClass(404, {}, "El usuario no existe").getResponseData();
  // }
  

  return responseClass;
};

export {
  getUserService,
  updatedUserService,
  updatedUserDetailService,
  deleteUserService,
  followUserService,
  unfollowUserService,
  getTotalPostsUser
};
