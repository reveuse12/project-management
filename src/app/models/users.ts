import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    organizations: [
      {
        organization: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Organization",
        },
        role: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
        },
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      maxlength: 100,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string | Buffer
) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
