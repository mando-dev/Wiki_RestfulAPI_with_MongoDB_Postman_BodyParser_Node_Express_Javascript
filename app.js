const express = require("express"); //WIKI RESTFUL API WITH MONGODB
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
    app.set('view engine', 'ejs'); //WIKI RESTFUL API WITH MONGODB
    app.use(bodyParser.urlencoded({extended: true})); // needed for when doing req.body.title, for example. So body parser looks for data being passed over from html forms
    app.use(express.static("public"));
        mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true}); // this allows mongoose to connect to our mongo database. articles are able to be reached through the API
        const articleSchema = {title: String, content: String}//we have two fields here: content and title. creating a new schema for collections. we can call our schema to whatever we want
        const Article = mongoose.model("Article", articleSchema);// has to be capitalized and the singular form. we are specifying the name of our collection: "Article" but mongoose will auto change this to a lowercase 'a' and make it plural. we are specifying the article schema we just created above 'articleSchema'. //our server is all set up above now. maybe i can use this as boiler plate. 
app.route("/articles",)
    .get((req, res)=>{  //creating our GET route that fetches all of the articles. This get method is from express. then we specify the route which is the entire collections of articles. notice how on next line we are using plural since its multiple articles-'foundArticles
        Article.find((err, foundArticles)=>{//querying our database and finding the 'Article' collections. We are leaving the first parameter of the find() method empty because we are tying to find all the collefctions. Then callback method can come back with an error or the results of th efind method. the arg 'foundArticles' was declared/made up here so I could of called it whatevert I wanted.  
            if(!err) {                              //just in case if theres an error from a get request. in this app.get we are requesting all articles from datatbase
                res.send(foundArticles);  //results are going to be sending all of these 'foundArticles'
                } else {// the main idea here in our get route is that we are setting up the resources for clients requests of our API, next we need to set up our POST,PUT, etc for our clients request
                    res.send(err); // this will show the error on the client side
                            } //client makes a get request to our server via our API             
                                }); // this /aricles is when a user hits enter it makes a get request
                                    })
.post((req, res)=>{  //postmans goal is to be able to make a post request to our server. during a post request, it should point a collection and not a single article    
    const newArticle = new Article({      //storing a new article. Looks like we are receiving data here in our post request/postman.       
    title: req.body.title,// tapping into body in order to grab some of the data that was sent through. 'tite' and 'content' come from the name attribute inside html input tags, so we have 2 inputs here.      //title is going to store data we received through the post request //defining our data that we want to create for our 2 fields
    content: req.body.content// body = body parser. title and content are the keys we are inputting into postman. this is being saved into mongodb // this is again, same as title, is the data being passed in via our pos   
                });// after you click on Send on postman, your variable request will show up in your terminal if you are console logging
                newArticle.save(function(err){//saving our new object into our database. I did the arrow function all here by myself. if you ever get errors, change this back
                    if (!err){
                        console.log("Succesffuly added new artice") 
                                }else {
                                    res.send(err); //sending back the error we got from mongoose
                                        }
                                            }); //SUMMARY: CLIENT IS MAKING POST REQUEST TO SEND DATA TO OUR SERVER VIA THE REPRESENTAIONAL STATE API
                                                })                                                           
.delete((req,res)=>{  // in this case, client is sending delete request to /articles. so this should delete all the articles in our collection
    Article.deleteMany((err)=>{// here we are not filling in the conditions parameter.  we are specifyin two arguments. The first argumetn is used as a FILTER to filter through our collections in the Article model to figuer out what to delete.        / inside this block of code is how the server will respond when client makes a request to delete. we using mongoose methods.
        if (!err) { //we are sending a delete request to our route '/articles'
            res.send("Successuly deleted all articles");
            }
                        else{
            res.send(err)
            }
            });
            }); // We put the whole callback function inisde get(), post(). deltete(), this is where we CHAIN our methods//we are using app.route to sort of compile and lessen our hardcoding since all these methods are targeting
app.route("/articles/:articleTitle") //fetching specific article. user has to use article title as parameter ": articleTitle ". articleTitle. wwatch your spaces here inside this string url becaue it can cause a bug
        .get(function(req, res){
        Article.findOne({title: req.params.articleTitle},(err, foundArticle)=>{  //tapping into the request the user made. Tapping into the 'params' that were passed in. 'articleTitle' is corresponding/matching to the 'articleTitle' in the URL. //title we are specifying must match title we got through the URL- this will be under the first parameter conditions.  the title in the URL is the one requested by the client. Seems like the word 'title' inside the object-first paramater was creted here. we must specify conditions here in the first argument sine we are filtering. the first parameter will happen first and thend the call back. We are using singular form of articleTitle because we are using mongoose method findOne()
                if (foundArticle) {             // if the article in database matches the one that client put in the url, then we will send that back to the client. 'foundArticle should be singular because we are using findOne. Inside here is wehre all the action is going to happen. 
                    res.send(foundArticle);    // notice we are using foundTitle and not articleTitle
                    }else {
                        res.send("the title from yourl URL did not match");
                    }
                    });
                })        // no cap since its chained        
            .put((req, res) =>{// this is the UPDATE method. a way to remember this is by the U in PUT, U for Update. update() is a mongoose method
                Article.update( //on postman, first it will match up w jack bauer and after the match it will update to chick norris via new titiel and content. 
                        {title: req.params.articleTitle},  //condition here is same as our .get         //in here we are going to be working with our mongodb to replace a particular documetn inside our articles collection. the update method is availahble to us through mongoose. u will overwrite the entire documetn if overwrite is true OR make it false to only update a particular field. 
                        {title: req.body.title, content: req.body.content}, //so body parser is looking for that data being passed over from html forms. this is body parser passin in our requestthis is the actual update that we want to make. this will work sort of in the way as the original post request where the client enters title and content on blog on the body. thus updating article we have found via search on the line above
                    {overwrite: true},//mongoose requires this. // the patch request is so not ALL of the doc/article gets replaced and only gets replaced partially
                    (err)=>{
                        if(!err){
                            res.send("successfully updated article");
                        }
                    }
                );  //capping off the chain
            }) // no colon becuase we are continuing the chain

        .patch((req, res) =>{// only updating a specific field in a specfic doc
            // the new TEST requests from postman
            
            Article.update(//so when client requests patch, body parser will repass the request and pick out the fields the client has chosen to update. 
                {title:req.params.articleTitle}, 
                {$set: req.body}, (err)=> { //basically the req.body is an object holding any and all fields that client eneters .we are updating the database for only the fields that have a new value.  we can learn more about the flag $set at mondodb docs. we are givgin the users field to choose which fields thhey want to update and which they dont.
                    if(!err) {
                    res.send("successfully updated article") ;
                } else {
                    res.send(err);
                }
                }
            );
            })// continuing chaining
.delete((req, res ) => { //deleting specific doc specified by client in url
    Article.deleteOne( // mongoose documentsation . Article is our collection
      {title:req.params.articleTitle}, (err) => {
        if(!err){
            res.send("successfully deleted corresponding article");

                    }else {
                        res.send(err); //sending errors to client
                }
                }
            );
        });//stopping the chain
        
        app.listen(3001, function() {
            console.log("Server on 3001");
        });

        // emacs   esc + x 