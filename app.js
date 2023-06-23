// Import required modules
const express = require("express"); // Express framework for building web applications
const https = require("https"); // HTTPS module for making HTTPS requests

// Create an instance of the Express application
const app = express();

// Configure the application
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Define a route for the root URL ("/")
app.get("/", (req, res) => {
  // Send the "signup.html" file as the response
  res.sendFile(__dirname + "/signup.html");
});

// Define a route for the POST request to the root URL ("/")
app.post("/", (req, res) => {
  // Extract form data from the request body
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  // Create a data object in the required format for Mailchimp API
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // Convert data object to JSON string
  const jsonData = JSON.stringify(data);

  // Set the URL for the Mailchimp API
  const url = "https://us21.api.mailchimp.com/3.0/lists/List_ID";

  // Set the options for the HTTPS request to Mailchimp API
  const options = {
    method: "POST",
    auth: "Auth Key",
  };

  // Send the HTTPS request to Mailchimp API
  const request = https.request(url, options, function (response) {
    // Handle the response from the Mailchimp API

    // If the response status code is 200 (success)
    if (response.statusCode === 200) {
      res.send("Success"); // Send "Success" as the response
    } else {
      res.send("Failure"); // Send "Failure" as the response
    }

    // Listen for the "data" event to receive response data from Mailchimp API
    response.on("data", function (data) {
      console.log(JSON.parse(data)); // Parse and log the response data
    });
  });

  // Write the JSON data to the request body
  request.write(jsonData);

  // End the request
  request.end();
});

// Start the server and listen on a specified port
app.listen(process.env.port || 3000, function () {
  console.log("site running at port 3000");
});
