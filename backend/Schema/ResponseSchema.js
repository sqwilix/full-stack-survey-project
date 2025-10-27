import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
    surveyId: {type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true},
    answers: [
        {
            questionIndex: Number,
            optionIndex: Number
        }
    ],
    ip: String,
    userAgent: String
}, {timestamps: true})

export default mongoose.model('Response', ResponseSchema)