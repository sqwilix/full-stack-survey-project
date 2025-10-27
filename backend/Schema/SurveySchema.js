import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [OptionSchema], default: [] }
});

const SurveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 50 },
    description: { type: String, required: true, minlength: 3, maxlength: 255 },
    image: { type: String, required: true },
    questions: { type: [QuestionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Survey', SurveySchema)