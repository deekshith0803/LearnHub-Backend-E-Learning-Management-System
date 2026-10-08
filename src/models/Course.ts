import mongoose, { type ObjectId } from "mongoose";

interface courseInterface {
  title: string;
  description: string;
  thumbnail: string;
  instructor: ObjectId;
  category: string;
  level: string;
  price: number;
  duration: number;
  requirements: string[];
  whatYouWillLearn: string[];
  status: boolean;
}

const courseSchema = new mongoose.Schema<courseInterface>(
  {
    title: {
      type: String,
      required: [true, "Pleaseenter your title"],
      minLength: [1, "Title contain atleast one letter"],
    },
    description: {
      type: String,
      required: [true, "Pleaseenter your description"],
      minLength: [1, "Title contain atleast one description"],
    },
    thumbnail: {
      type: String,
      required: [true, "Please provide course thumbnail"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    category: {
      type: String,
      required: [true, "Please enter course category"],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: {
      type: Number,
      required: [true, "Please enter course price"],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, "Please enter course duration"],
    },
    requirements: {
      type: [String],
      default: [],
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
const Course = mongoose.model<courseInterface>("Course", courseSchema);
export default Course;
