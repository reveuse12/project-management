import connectDB from "../db/connectDB";
import User from "../models/users";

export const generateTokenAndRefreshTokens = async (userId: string) => {
  try {
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshTokens = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw error;
  }
};
