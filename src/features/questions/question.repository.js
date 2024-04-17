import mongoose from "mongoose";
import { ApplicationError } from "../../Error-handler/applicationerror.js";
import QuestionModel from "./question.schema.js";

export default class QuestionRepository {

    async addQuestion(questionData) {
        try {
            const { title } = questionData;
            const newQuestion = new QuestionModel({
                title: title
            });
            const savedQuestion = await newQuestion.save();
            return { success: true, res: savedQuestion }

        } catch (err) {
            throw new ApplicationError("Something went wrong, please try later", 500);
        }
    }

    async addOptions(questionId, data) {
        try {
            const { options } = data;
            const questionExist = await QuestionModel.findById(new mongoose.Types.ObjectId(questionId));
            if (questionExist) {
                options.forEach(option => {
                    questionExist.options.push(option);
                });
                const savedQuestion = await questionExist.save();
                return { success: true, res: savedQuestion }
            } else {
                return { success: false, res: "Question not found" }
            }


        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                throw err;
            }
            throw new ApplicationError("Something went wrong, please try later", 500);
        }
    }

    async deleteQuestion(questionId) {
        try {
            const questionExist = await QuestionModel.findById(new mongoose.Types.ObjectId(questionId));
            if (questionExist) {
                if (questionExist.options.length > 0) {
                    for (const option of questionExist.options) {
                        if (option.votes !== 0) {
                            // If any option has votes, don't delete the question
                            return { success: false, res: "Vote exist can't delete" }
                        }
                    }

                    // If none of the options have votes, delete the question
                    const result = await QuestionModel.findByIdAndDelete(questionId);
                    return { success: true, res: result };
                }

            } else {
                return { success: false, res: "Question not found" }
            }

        } catch (err) {
            throw new ApplicationError("Something went wrong, please try later", 500);
        }
    }

    async deleteOption(optionId) {
        try {
            const result=await QuestionModel.aggregate([
                { $unwind: "$options" }, // Unwind the options array to deconstruct it into separate documents
                { $match: { "options._id": new mongoose.Types.ObjectId(optionId) } }, // Match documents where the option ID matches
                {
                    $project: {
                        option: "$options" // Include the matched option
                    }
                }
            ])
            if (result.length === 0) {
                // Option not found
                return { success: false, res: "Option not found" };
            }
            const vote=result[0].option.votes;
            if(vote==0){
                //Delete the options
                await QuestionModel.updateOne({"options._id":result[0].option._id},{$pull:{options:{_id: result[0].option._id }}})
                return{success:true,res:"option deleted"}
            }else{
                return{success:false,res:"vote exist cannot delete this option"}
            }
            
        } catch (err) {
            throw new ApplicationError("Something went wrong, please try later", 500);
        }
    }

    async addVote(optionId) {
        try {
            const result=await QuestionModel.aggregate([
                { $unwind: "$options" }, // Unwind the options array to deconstruct it into separate documents
                { $match: { "options._id": new mongoose.Types.ObjectId(optionId) } }, // Match documents where the option ID matches
                {
                    $project: {
                        option: "$options" // Include the matched option
                    }
                }
            ]);
            if (result.length === 0) {
                // Option not found
                return { success: false, res: "Option not found" };
            }else{
                await QuestionModel.updateOne({"options._id":result[0].option._id},{$inc:{"options.$.votes":1}})
                return { success: true, res: `Vote is added`}
            }
        } catch (err) {
            throw new ApplicationError("Something went wrong, please try later", 500);
        }
    }

    async getQuestion(questionId) {
        try {
            const question = await QuestionModel.findById(new mongoose.Types.ObjectId(questionId));
            if (question) {
                return { success: true, res: question }
            } else {
                return { success: false, res: "Question not found" }
            }


        } catch (err) {
            throw new ApplicationError("Something went wrong, please try later", 500);
        }
    }
}