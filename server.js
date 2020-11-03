//Requires
const express = require("express");
const path = require("path");
const fs = require("fs");


//Set up express

const app = express();
const PORT = (process.env.PORT || 3000)


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('Develop/public'));


//Data Parsing
let dbNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"))

app.get("/", function(req, res) {
    res.json(path.join(__dirname, "Develop/public/index.html"));
  });


//HTML ROUTES
// * GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"))
});
//API ROUTES 
// * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.

app.get("/api/notes", function(req, res){
    res.sendFile(path.join(__dirname, "/Develop/db/db.json"));
});

app.get("/api/notes/:id", function(req, res){
    res.json(dbNotes[req.params.id]);
});

// * GET `*` - Should return the `index.html` file

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "Develop/public/index.html"))
});

// * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.

app.post("/api/notes", function(req, res){
    var addNotes = req.body
    var uniqueID = (dbNotes.length).toString()
    addNotes.id = uniqueID
    dbNotes.push(addNotes)

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(dbNotes))
    res.json(dbNotes);
    
})

// * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

app.delete("/api/notes/:id", function(req, res){
    var noteID = req.params.id;
    var newID = 0;
    dbNotes = dbNotes.filter(function(currNote){
        return currNote.id !=noteID;
    })
    for (currNote of dbNotes){
        currNote.id = newID.toString();
        res.json(dbNotes);
    }

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(dbNotes))
    res.json(dbNotes)
});

//Listen for the server
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

