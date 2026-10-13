import mongoose from "mongoose";

interface QuestionInterface {
  _id: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizInterface {
  course: mongoose.Types.ObjectId;
  title: string;
  questions: QuestionInterface[];
}

const questionSchema = new mongoose.Schema<QuestionInterface>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    options: {
      type: [String],
      required: [true, "Question options are required"],
      validate: {
        validator: (Option: string[]) => Option.length >= 2,
        message: "At least two options are required",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
    },
  },
  { _id: true },
);

const quizSchema = new mongoose.Schema<QuizInterface>(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    title: {
      type: String,
      required: [true, "Quiz title is required"],
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Quiz = mongoose.model<QuizInterface>("Quiz", quizSchema);

export default Quiz;
