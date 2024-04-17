
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    options: {
        type:[
            {
                text: { type: String,required:true },
                votes: { type: Number },
                link_to_vote: { type: String },
                
            }

        ], validate: {
            validator:arrayLimit,message:"Only 4 options are allowed"
        }
    }
});
function arrayLimit(val) {
    return val.length <= 4;
}
//generate link to vote
function generateVoteLink(optionId) {
    return `http://localhost:3100/api/poll/options/${optionId}/add_vote`;
}

questionSchema.pre('save', function(next){
    const options= this.options;
    options.forEach(option => {
        option.link_to_vote = generateVoteLink(option._id); // Assuming _id is the option's ID
    });
    next();
})

const QuestionModel=mongoose.model("Question",questionSchema);
export default QuestionModel;