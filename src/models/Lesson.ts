import mongoose from "mongoose";

interface LessonInterface {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  course: mongoose.Types.ObjectId;
}

const lessonSchema = new mongoose.Schema<LessonInterface>(
  {
    title: {
      type: String,
      required: [true, "Please enter lesson title"],
    },

    description: {
      type: String,
      required: [true, "Please enter lesson description"],
    },

    videoUrl: {
      type: String,
      required: [true, "Please provide video URL"],
    },

    duration: {
      type: Number,
      required: [true, "Please enter lesson duration"],
    },

    order: {
      type: Number,
      required: [true, "Please enter lesson order"],
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Lesson = mongoose.model<LessonInterface>("Lesson", lessonSchema);

export default Lesson;
