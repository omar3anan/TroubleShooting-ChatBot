import elasticsearch from '@elastic/elasticsearch'

export const client = new elasticsearch.Client({
    node: 'http://localhost:9200'
  })
  client.ping()
    .then(response => console.log("You are connected to Elasticsearch!"))
    .catch(error => console.error(error))


export async function createIndex() {
        try {
        await client.indices.create({ index: 'questions' });
          console.log('Index created');
        } catch (error) {
          console.error('Error creating index:', error);
        }
}
    

export async function AddDocument( docId , question , answer , tag ,rate){
  try {
      const indexName = 'questions'; 
      const Question = {
          Question : question ,
          Answer : answer ,
          Tag: tag,
          Rate : rate
      };
      

      await client.index({
          index: indexName,
          id: docId ,
          body: Question
      })
      
      console.log('Question inserted:');
      return;
    } catch (error) {
      console.error('Error inserting Question:', error);
    }
}
    
          

export async function SearchForDocument(question) {
  
    const body = await client.search({
        index: 'questions',
        body: {
            query: {
              match: {
                Question: question
              }
            }
        }
    })
     
    return body.hits.hits;
}

export  async function retrieveAllDocuments() {
    try {
      const indexName = 'questions'; 
      
      const body = await client.search({
        index: indexName,
        body: {
          query: {
            match_all: {} // Match all documents
          }
        }
      });
      
      
      return body.hits.hits;
    } catch (error) {
      console.error('Error retrieving documents:', error);
      throw error;
    }
  }

  export async function UpdateDocument(id, updatedFields) {
     
    try {
        await client.update({
        index: "questions",
        id,
        body: {
          doc: updatedFields,
        },
      });
      console.log('Document updated');
    } catch (error) {
      console.error('Error updating document:', error);
    }
}

export async function updateRate(questionId , newRate){
  try {
    let targetDoc = await GetDocumentById(questionId);
    targetDoc._source.Rate = newRate;
  let id = questionId;

    //NOTE:-> must be {index , id ,body} do not update nameing 
    await client.update({
    index: "questions",
    id ,
    body: {
      doc: targetDoc._source ,
    },
  });
    
  console.log('Document updated');
} catch (error) {
  console.error('Error updating document:', error);
}
}

export async function DeleteDocument(docId) {
  console.log('Document ');
    try {
      const indexName = 'questions'; 
      const documentId = docId;
  
        await client.delete({
        index: indexName,
        id: documentId
      });
  
      console.log('Document deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
}

export async function GetDocumentById(documentId) {
  try {
    const indexName = 'questions'; 

    const getResponse = await client.get({
      index: indexName ,
      id: documentId
    });

     return getResponse;
  } catch (error) {
    if (error.statusCode === 404) {
      console.log('Document not found');
    } else {
      console.error('Error retrieving document:', error);
    }
  }
}

export async function createIndexMapping(indexName) {
    try {
      await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              Question: { type: 'text' },
              Answer: { type: 'text' },
            },
          },
        },
      });
      console.log('Index created');
    } catch (error) {
      console.error('Error creating index:', error);
    }
  }



  export async function DeleteIndex (indexName) {
    try {
      await client.indices.delete({ index: indexName });
      console.log(`Index '${indexName}' successfully deleted.`);
    } catch (error) {
      console.error(
        `An error occurred while deleting the index '${indexName}': ${error}`
      );
    }
  };

export  async function checkDocumentExistence(documentId) {
    try {
      
      const response = await client.exists({
        index: "questions",
        id: documentId,
      });
      
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

export  async function searchQuestionByMatchingPhrase(question) {
    try {
      const response = await client.search({
        index: 'questions',
        body: {
          query: {
            match_phrase: {  // do and and order and must all terms exist in target filed
              Question: question,
            },
          },
        },
      });
  
      return response.hits.hits;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

export  async function searchWithMultiMatch(question) {
    try {
      const response = await client.search({
        index: 'questions',
        body: {
          query: {
            multi_match: {
              query: question,
              fields: ['Question' , 'Answer'],
            },
          },
        },
      });
  
      return response.hits.hits;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }






  //await AddDocument('how to work at google' , 'problem solving' , 'JOBS' ,'93c9f894-7491-4b4b-85cd-0810889e4309')
  //console.log(await searchWithMultiMatch('node js Engage'));
  //console.log(await searchWithMultiMatch('Engage'));
  //console.log(await searchQuestionByMatchingPhrase('tech stack used  at the Dstny')); //---->[]
  //console.log(await searchQuestionByMatchingPhrase('Dstny'));
 
//=================================================================================
//await elastic.createIndex();
//await elastic.AddDocument("how to intall node js" , "vist this website https://nodejs.org/en");
//await elastic.SearchForDocument("how to intall node js");

//await elastic.DeleteDocument('DQPY3okB7TpzI3v9kqSF')
//console.log(await elastic.retrieveAllDocuments());
//console.log(await elastic.GetDocumentById('VBPf3okBVTPijfBv7G22'));
// const updateQuestion = {
 
//   Answer : "vist this website https://nodejs.org/en or ask chatgpt"
// };

// await elastic.UpdateDocument('VRPh3okBVTPijfBv5m0d',updateQuestion);
// console.log(await elastic.retrieveAllDocuments());
//console.log(await checkDocumentExistence('fbCi34kBj45NM6FxH8Is'))

//=================================================================================