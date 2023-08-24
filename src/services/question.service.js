
import { Question } from '../models/question.model.js';
import { Answer } from '../models/answer.model.js'

export async function addQuestion(question_text, has_answer, tag, answer_text, rate) {
  const newQuestion = await Question.create({
    question_text, tag, has_answer
  });
  console.log(newQuestion);
  
  

  let question_id = newQuestion.id;
  const newAnswer = await Answer.create({
    answer_text, rate, question_id
  });
  console.log(newAnswer);
  console.log("====================================");
  
  return question_id;
}

export async function updateQuestion(questionId, question_text, has_answer, tag , answer_text, rate) {
  const resultQuestion = await Question.update(
    { question_text, tag, has_answer, updatedAt: Date.now() },
    {
      where: {
        id: questionId,
      },
    }
  );
  const resultAnswer = await Answer.update(
    { answer_text, rate, updatedAt: Date.now() },
    {
      where: {
        question_id: questionId,
      },
    }
  );

  return resultAnswer;
}

export async function deleteQuestionById(questionId) {
  const resultDelAnswer = await Answer.destroy({
    where: { question_id: questionId },
    force: true,
  });

  const result = await Question.destroy({
    where: { id: questionId },
    force: true,
  });
  return result;
}

export async function updateRate(questionId , newRate){
  const resultAnswer = await Answer.update(
    { rate: newRate , updatedAt: Date.now() },
    {
      where: {
        question_id: questionId,
      },
    }
  );

  return resultAnswer;
}

//await updateRate('3693f887-9788-4486-934a-8ba2c90cc433' , 10)
let targetid =await addQuestion('HOW MUCH JOUNIOR TAKE AT moomo', true, 'jobs', 'YEH 400$ ', 3.33);
//console.log(await deleteQuestion(targetid))
//updateQuestion('14c72f77-235a-4869-9e9d-489f739eb5f7','HOW MUCH JOUNIOR TAKE AT DSTNY Engadge',true,'JOBS','YEH 500$ ', 10)


