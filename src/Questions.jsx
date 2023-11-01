import React from "react"
import { useState , useEffect} from 'react'
import he from 'he'

export default function Questions() {
    const [allQuestions, setallQuestions] = useState([])
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [isChecked, setisChecked] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          // Generate a random index between 0 and i (inclusive).
          const randomIndex = Math.floor(Math.random() * (i + 1));
          // Swap elements at randomIndex and i.
          const temp = array[i];
          array[i] = array[randomIndex];
          array[randomIndex] = temp;
        }
        return array;
    }
    function decodeArray(array) {
        const decodedArray = array.map((str) => he.decode(str));
        return decodedArray;
      }
    function fetchNewQuestions(){
        fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
            .then(res => res.json())
            .then(data => {
                setallQuestions(
                    data.results.map(result => {
                        return {
                            ...result,
                            question: he.decode(result.question),
                            incorrect_answers: decodeArray(result.incorrect_answers),
                            correct_answer: he.decode(result.correct_answer),
                            answers: shuffleArray([...decodeArray(result.incorrect_answers),he.decode(result.correct_answer)]),
                            clickedAnswerIndex: null,
                            isclickedCorrect: null
                        }
                    })
                )
                setSelectedAnswers(Array(data.results.length).fill(null)) 
                setisChecked(false)
                setCorrectCount(0)
            })
    }
    useEffect(()=>{
        fetchNewQuestions()
    },[]) 

    function handleAnswerClick(questionIndex, answerIndex){
        const updatedSelectedAnswers = [...selectedAnswers]
        updatedSelectedAnswers[questionIndex] = answerIndex
        setSelectedAnswers(updatedSelectedAnswers)

        const updatedAllQuestions = [...allQuestions]
        updatedAllQuestions[questionIndex] = {...updatedAllQuestions[questionIndex], clickedAnswerIndex: answerIndex}
        setallQuestions(updatedAllQuestions)
    }


    function checkAnswer(selectedAnswers){
        setisChecked(true)
        const updatedAllQuestions = allQuestions.map(question=>(
            {...question, isclickedCorrect: question.answers.indexOf(question.correct_answer) === question.clickedAnswerIndex}
            ))
        setallQuestions(updatedAllQuestions) 
        setCorrectCount(updatedAllQuestions.reduce((acc, obj)=> (obj.isclickedCorrect? acc+1 : acc), 0))
    }
    console.log(correctCount)
    console.log(allQuestions)

    function resetQuiz(){
        fetchNewQuestions()
        setisChecked(false)
    }
    const allquestionsEl = allQuestions.map((data, questionIndex) => (
        <div key={questionIndex} className="question-container">
          <div>{data.question}</div>
          <div className="answer-container">
            {data.answers.map((answer, answerIndex) => {
                let styles = {}
                const correctAnswerIndex = answer.indexOf(data.correct_answer)
                if(!isChecked){
                    if(answerIndex === data.clickedAnswerIndex){
                        styles = {backgroundColor: "#D6DBF5"}
                    }
                }
                if (isChecked) {
                    if (answerIndex === data.clickedAnswerIndex) {
                      if (data.isclickedCorrect) {
                        styles = { backgroundColor: "#94D7A2" };
                      } else {
                        styles = { backgroundColor: "#F8BCBC" };
                      }
                    } else if (
                      !data.isclickedCorrect &&
                      answerIndex === data.answers.indexOf(data.correct_answer)
                    ) {
                      styles = { backgroundColor: "#94D7A2" };
                    }
                  }
          
                
                return  <button key={answerIndex} className="answer-btn" onClick={()=>handleAnswerClick(questionIndex, answerIndex)}
                        style = {styles}
                        >
                        {answer}
                        </button>
            })}
          </div>
        </div>
      ));
      
    return(
        <section>
            {allquestionsEl}
            {!isChecked? <button className="check-btn" onClick={()=>checkAnswer(selectedAnswers)}>Check answers</button>
            : <div className="score-container">
                <span>{`You scored ${correctCount}/5 correct answers`}</span> 
                <button className="start-btn" onClick={resetQuiz}> Play again </button>
              </div>      
            }
        </section>
    )
}
