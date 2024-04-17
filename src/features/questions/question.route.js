import express from 'express'
import QuestionController from './question.controller.js';

const questionController= new QuestionController();
const questionRouter= express.Router();

questionRouter.route('/questions/create').post((req,res,next)=>{
    questionController.createQuestion(req,res,next);
})
questionRouter.route('/questions/:id/options/create').post((req,res,next)=>{
    questionController.addOptions(req,res,next);
})
questionRouter.route('/questions/:id/delete').delete((req,res,next)=>{
    questionController.deleteQuestion(req,res,next);
})
questionRouter.route('/options/:id/delete').delete((req,res,next)=>{
    questionController.deleteOption(req,res,next);
})
questionRouter.route('/options/:id/add_vote').post((req,res,next)=>{
    questionController.addVote(req,res,next);
})
questionRouter.route('/questions/:id').get((req,res,next)=>{
    questionController.getQuestionById(req,res,next);
})

export default questionRouter;