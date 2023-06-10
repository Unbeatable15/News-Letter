const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');
const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signUp.html");
});

app.post("/",(req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log(firstName,lastName,email);
    const data = {
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const JSONstr = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/c1a04920b4";
    const options = {
        method:"POST",
        auth:"apikey:a47669367fcd33824d293b874e89f3bb-us21"
    }
    const request = https.request(url,options,(response)=>{
        response.on("data",(data)=>{
            if(response.statusCode === 200){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html")
            }
        });
    });
    request.write(JSONstr);
    request.end();
});


app.post("/failure",(req,res)=>{
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is listening to port 3000.");
})

//API Key : a47669367fcd33824d293b874e89f3bb-us21
//List ID : c1a04920b4