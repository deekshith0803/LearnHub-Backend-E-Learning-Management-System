import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface UserInterface {
  name: string;
  email: string;
  password: string;
  role: "student" | "admin" | "instructor";
  status: boolean;
  bio?: string;
  profilePicture?: string;
}

export const userSchema = new mongoose.Schema<UserInterface>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      minlength: [2, "Name must contain at least two letters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must contain at least six characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin", "instructor"],
      default: "student",
    },

    status: {
      type: Boolean,
      default: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: [300, "Bio cannot exceed 300 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model<UserInterface>("User", userSchema);

export default User;
