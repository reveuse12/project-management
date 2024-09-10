import connectDB from "../db/connectDB";
import { cookies } from "next/headers";
import User from "../models/users";
import jwt, { JwtPayload } from "jsonwebtoken";

// Generate access and refresh tokens for a user
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

// Decrypt the token
export const decryptToken = async (
  token: string
): Promise<JwtPayload | null> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Ensure the decoded token is a JwtPayload and not a string
    if (typeof decoded === "object" && "exp" in decoded) {
      return decoded as JwtPayload;
    }

    return null; // If the token is not a valid JwtPayload
  } catch (error) {
    console.error("Error decrypting token:", error);
    throw error;
  }
};

// Extract the token from cookies and verify it
export const cookieExtraction = async (): Promise<JwtPayload | null> => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    // Decrypt and verify the token
    const decodedToken = await decryptToken(token.value);

    if (!decodedToken || !decodedToken._id) {
      throw new Error("Unauthorized: Invalid token");
    }

    return decodedToken;
  } catch (error) {
    console.error("Error extracting cookies:", error);
    throw error;
  }
};
