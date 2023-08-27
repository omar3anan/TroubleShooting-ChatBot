import { google } from 'googleapis';
import technicalArrayKeyword from './technicalKeywords.js'
import express from 'express';
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const documentId = ""; // Google Doc ID
app.use(express.json());

app.post("/q-a", async (req, res) => {
  const { question, answer } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/documents",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Docs API
  const googleDocs = google.docs({ version: "v1", auth: client });

  // Get the document's content
  const document = await googleDocs.documents.get({
    documentId,
  });

  // Get the existing content from the document
  const existingContent = document.data.body.content;

  // Construct the new content to be added
  const newContent = [
    {
      insertText: {
        location: {
          index: existingContent.length, // Append at the end
        },
        text: `Question: ${question}, Answer: ${answer}\n`, // Use request and name fields
      },
    },
  ];

  // Add content to the document
  await googleDocs.documents.batchUpdate({
    documentId,
    resource: {
      requests: newContent,
    },
  });

  res.send("Successfully submitted! Content added to the document. Thank you!");
});


app.get("/document", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/documents.readonly",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Docs API
  const googleDocs = google.docs({ version: "v1", auth: client });

  // Get the document's content
  const document = await googleDocs.documents.get({
    documentId,
  });

  const content = document.data.body.content;

  // Extract text from the content
  const extractedText = content
    .map((item) =>
      item.paragraph
        ? item.paragraph.elements
          .map((element) => element.textRun.content)
          .join("")
        : ""
    )
    .join("\n");
  console.log(extractedText);

  res.status(200).json({
    status: "success",
    data: {
      extractedText,
    },
  });
});

//==========================================================================================================
async function searchQuery(keyword) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/documents",
    });

    const client = await auth.getClient();
    const googleDocs = google.docs({ version: "v1", auth: client });

    const document = await googleDocs.documents.get({
      documentId,
    });

    // Extract the content of the document
    const content = document.data.body.content;

    // Flags to track article and keyword found status, and capturing content
    let articleFound = false;
    let articleContent = "";

    let keywordFound = false;
    let capturingContent = false;

    // Iterate through the content of the document
    for (const item of content) {
      if (articleFound) {
        break; // Exit the loop if the article is found
      }

      if (item.paragraph) {
        for (const element of item.paragraph.elements) {
          if (element.textRun) {
            const contentText = element.textRun.content;

            if (capturingContent && element.textRun.textStyle.bold) {
              articleFound = true; // Mark article as found if bold text encountered
              break;
            }

            if (contentText.toLowerCase().includes(keyword)) {
              keywordFound = true; // Mark keyword as found
              capturingContent = true; // Start capturing content
            }

            if (capturingContent) {
              articleContent += contentText; // Accumulate content text
            }
          }
        }
      }
    }

    // Return information about whether article and keyword were found, along with the article content
    return { articleFound, articleContent };
  } catch (error) {
    // Handle errors: log the error and return default values
    console.error("Error searching for keywords:", error);
    return { articleFound: false, articleContent: "" };
  }
}



function findTechnicalKeywords(question) {
  const keywords = question.toLowerCase().split(" ");
  const foundKeywords = [];

  for (const keyword of keywords) {
    if (technicalArrayKeyword.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }

  return foundKeywords;
}

export async function getAnswerFromGoogleDocs(question) {


  const foundKeywords = findTechnicalKeywords(question);

  if (foundKeywords.length > 0) {
    const results = [];

    for (const keyword of foundKeywords) {
      const { articleFound, articleContent } = await searchQuery(keyword);
      if (articleFound) {
        results.push(articleContent);
      }

    }

    return results;
  } else {
    return [];
  }
}

// let result = await getAnswerFromGoogleDocs('what is frontend and Linux');
// console.log(result.length);
// console.log(result);


//console.log(await searchQuery('frontend'));


