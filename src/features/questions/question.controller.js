import QuestionRepository from "./question.repository.js"

export default class QuestionController {
    constructor() {
        this.questionRepository = new QuestionRepository();
    }

    async createQuestion(req, res, next) {
        try {
            const result = await this.questionRepository.addQuestion(req.body);
            if (result.success) {
                res.status(201).json({ success: true, res: result.res })
            }

        } catch (err) {
            next(err)
        }
    }
    async addOptions(req, res, next) {
        try {
            const questionId = req.params.id;
            const result = await this.questionRepository.addOptions(questionId, req.body);
            if (result.success) {
                res.status(201).json({ success: true, res: result.res })
            } else {
                res.status(404).json({ success: false, res: result.res })
            }

        } catch (err) {
            next(err)
        }

    }
    async deleteQuestion(req, res, next) {
        try {
            const questionId = req.params.id;
            const result = await this.questionRepository.deleteQuestion(questionId);
            if (result.success) {
                res.status(201).json({ success: true, res: result.res })
            } else {
                res.status(404).json({ success: false, res: result.res })
            }

        } catch (err) {
            next(err)
        }
    }

    async deleteOption(req, res, next) {
        try {
            const optionId = req.params.id;
            const result = await this.questionRepository.deleteOption(optionId);
            if (result.success) {
                res.status(201).json({ success: true, res: result.res })
            } else {
                res.status(404).json({ success: false, res: result.res })
            }

        } catch (err) {
            next(err)
        }
    }

    async addVote(req, res, next) {
        try {
            const optionId = req.params.id;
            const result = await this.questionRepository.addVote(optionId);
            if (result.success) {
                res.status(201).json({ success: true, res: result.res })
            } else {
                res.status(404).json({ success: false, res: result.res })
            }

        } catch (err) {
            next(err)
        }
    }

    async getQuestionById(req, res, next) {
        try {
            const questionId = req.params.id;
            const result = await this.questionRepository.getQuestion(questionId);
            if (result.success) {
                res.status(201).json({ success: true, res: result.res })
            } else {
                res.status(404).json({ success: false, res: result.res })
            }

        } catch (err) {
            next(err)
        }
    }
}