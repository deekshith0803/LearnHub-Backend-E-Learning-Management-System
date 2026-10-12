import mongoose from "mongoose";

interface ProgressInterface {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
  percentage: number;
}

const progressSchema = new mongoose.Schema<ProgressInterface>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

const Progress = mongoose.model<ProgressInterface>("Progress", progressSchema);

export default Progress;
