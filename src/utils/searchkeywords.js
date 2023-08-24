import technicalArrayKeyword from './technicalKeywords.js';

export async  function findTechnicalKeywords(question) {
    const keywords = question.toLowerCase().split(" ");
    let foundKeywords = "";
  
    for (const keyword of keywords) {
      if (technicalArrayKeyword.includes(keyword)) {
        foundKeywords+= keyword;
        foundKeywords+= " ";
      }
    }
    return foundKeywords;
  }

//console.log(findTechnicalKeywords('how to use Node js and Git'))

//   //call the function to get the technical keywords
//   const foundKeywords = findTechnicalKeywords(questionToSearch);
//   if (foundKeywords.length > 0) {
//     console.log("Found technical keywords:", foundKeywords);
//     for (const keyword of foundKeywords) {
//       searchQuery(keyword);
//     }
//   } else {
//     console.log("No technical keywords found in the question.");
//   }
