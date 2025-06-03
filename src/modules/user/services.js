import ApiError from "../../utils/apiError.js";
import {
  getUser,
  getAllUsers,
  deleteUserById,
  updateUserById,
} from "./repository.js";

export const getCurrentUserService = async (userId) => {
  const user = await getUser(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }
  return {
    status: "success",
    user: user,
  };
};
export const getAllUsersService = async () => {
  const users = await getAllUsers();

  if (!users || users.length === 0) {
    throw new ApiError("No users found", 404);
  }
  return {
    status: "success",
    users: users,
  };
};
export const deleteUserService = async (userId) => {
  const deletedUser = await deleteUserById(userId);

  if (!deletedUser) {
    throw new ApiError("User not found", 404);
  }
  return {
    status: "success",
    message: "User deleted successfully",
    user: deletedUser,
  };
};
export const updateUserService = async (userId, updateData) => {
  const updatedUser = await updateUserById(userId, updateData);

  if (!updatedUser) {
    throw new ApiError("User not found", 404);
  }
  return {
    status: "success",
    message: "User updated successfully",
    user: updatedUser,
  };
};
