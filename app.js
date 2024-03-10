/*
    SETUP
*/

// Express
const express = require('express');

const app = express();

app.use(express.json())
// app.use(bodyParser.json()); // Devon integration (breaks app when enabled)

app.use(express.urlencoded({extended: true}))


PORT = 31693;

// Database
const db = require('./database/db-connector');

// const path = require('path');  //Devons
// const bodyParser = require('body-parser'); // Devons

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Static Files
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public'))); // Devons

/*
    ROUTES
*/
app.get('/', function(req, res)
{  
    let query1 = "SELECT * FROM bsg_people;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

app.get('/MilitaryBranches', function(req, res)
{  
    let query1 = "SELECT * FROM MilitaryBranches;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('MilitaryBranches', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

// Inside your app.js file
app.post('/add-branch-form', (req, res) => {
    const newBranchName = req.body['input-new-branch'];
  
    // Input validation
    if (!newBranchName) {
      return res.sendStatus(400); // Bad request
    }
  
    const sqlQuery = 'INSERT INTO MilitaryBranches (name) VALUES (?)';
    db.pool.query(sqlQuery, [newBranchName], (error, results, fields) => {
      if (error) {
        console.error("Error adding branch:", error);
        res.sendStatus(500); // Internal server error
      } else {
        res.redirect('/MilitaryBranches'); // Redirect back to MilitaryBranches page
      }
    });
});

// New route for navigating to Bases.hbs
app.get('/Bases', function(req, res)
{  
    let query1 = "SELECT * FROM Bases;";               // Define our query

    if (req.query.location === undefined)
    {
        query1 = "SELECT * FROM Bases;";
    }
    
    else
    {
        query1 = `SELECT * FROM Bases WHERE location LIKE "${req.query.location}%"`
    }

    let query2 = "SELECT * FROM MilitaryBranches;";

    // Filter by branch if selected
    if (req.query['branch-filter'] !== undefined && req.query['branch-filter'] !== '') {
        query1 = `SELECT * FROM Bases WHERE branchId = ${req.query['branch-filter']}`;
    }

    

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        
        let data = rows;

        db.pool.query(query2, (error, rows, fields) => {

            let MilitaryBranches = rows;

            // Create the branch map
            let branchmap = {}
            MilitaryBranches.map(branch => {
                let id = parseInt(branch.branchId, 10);
                branchmap[id] = branch.name;
            })

            // Update the branch information in the 'data' object
            data = data.map(base => {
                return Object.assign(base, {branchId: branchmap[base.branchId]})
            })

            return res.render('Bases', {data: data, MilitaryBranches: MilitaryBranches});
        })    
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.post('/add-base-form', function(req, res) {
    let data = req.body;
    let branchId = parseInt(data['input-branchId']);
    if (isNaN(branchId))
    {
        branchId = 'NULL'
    }    
    
    query1 = `INSERT INTO Bases (name, location, branchId) VALUES ('${data['input-name']}', '${data['input-location']}', ${branchId})`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/Bases');
        }
    })
});


app.post('/add-personnel-form', function(req, res){
    let data = req.body;
    let baseId = parseInt(data['input-baseId']);
    if (isNaN(baseId)) {
        baseId = 'NULL';
    }

    let query = `INSERT INTO Personnel (name, rank, role, baseId) VALUES ('${data['input-name']}', '${data['input-rank']}', '${data['input-role']}', ${baseId})`;
    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/Personnel');
        }
    });
});

app.delete('/delete-personnel-ajax', function(req, res){
    let data = req.body;
    let personnelId = parseInt(data.id);
    let deleteQuery = `DELETE FROM Personnel WHERE personnelId = ?`;

    db.pool.query(deleteQuery, [personnelId], function(error, results, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


app.delete('/delete-base-ajax', function(req, res, next) {
    let data = req.body;
    let baseId = parseInt(data.id);
    let deleteBase = `DELETE FROM Bases WHERE baseId = ?`;
  
    db.pool.query(deleteBase, [baseId], function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    });
});

app.delete('/delete-branch-ajax', function(req, res, next) {
    let data = req.body;
    let branchId = parseInt(data.id);
    let deleteBranchQuery = `DELETE FROM MilitaryBranches WHERE branchId = ?`;
  
    db.pool.query(deleteBranchQuery, [branchId], function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400); // Bad Request
      } else {
        res.sendStatus(204); // No Content (Success)
      }
    });
});
  

app.put('/update-base-ajax', function(req, res, next) {
    let data = req.body;
    let baseId = parseInt(data.baseId);
    let newLocation = data.location;
  
    let updateLocation = `UPDATE Bases SET location = ? WHERE baseId = ?`;
  
    db.pool.query(updateLocation, [newLocation, baseId], function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
});

app.put('/update-personnel-ajax', function(req, res, next) {
    let data = req.body;
    let personnelId = parseInt(data.personnelId);
    let name = data.name;
    let rank = data.rank;
    let role = data.role;
    let baseId = parseInt(data.baseId);
  
    let updatePersonnel = `UPDATE Personnel SET name = ?, rank = ?, role = ?, baseId = ? WHERE personnelId = ?`;
  
    db.pool.query(updatePersonnel, [name, rank, role, baseId, personnelId], function(error) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
});

app.put('/update-munitions-ajax', function(req, res, next) {
    let data = req.body;
    let munitionId = parseInt(data.munitionId);
    let newType = data.type;
    let newSpecs = data.specs;
    let newQuantity = parseInt(data.quantity);

    let updateMunitions = `UPDATE Munitions SET type = ?, specs = ?, quantity = ? WHERE munitionId = ?`;

    db.pool.query(updateMunitions, [newType, newSpecs, newQuantity, munitionId], function(error) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
});

app.put('/update-military-branch-ajax', function(req, res, next) {
    let data = req.body;
    let branchId = parseInt(data.branchId);
    let newName = data.name;
  
    let updateBranchQuery = `UPDATE MilitaryBranches SET name = ? WHERE branchId = ?`;
  
    db.pool.query(updateBranchQuery, [newName, branchId], function(error) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
});

// New route for navigating to Munitions.hbs
app.get('/Munitions', function(req, res) {
    let query1 = "SELECT * FROM Munitions"; // Your original query
  
    // Filter if a type is selected
    if (req.query['type-filter'] !== undefined && req.query['type-filter'] !== '') {
        query1 += ` WHERE type = '${req.query['type-filter']}'`;
    }
  
    db.pool.query(query1, function(error, rows, fields){   
          let munitions = rows;
  
          // Additional query to get unique munition types for the dropdown
          let query2 = "SELECT DISTINCT type from Munitions"; 
  
          db.pool.query(query2, (error, types, fields) => {
              let MunitionTypes = types.map(typeObj => typeObj.type); // Extract types
  
              res.render('Munitions', { data: munitions, MunitionTypes: MunitionTypes }); 
          })
    })
});

// Inside your app.js
app.delete('/delete-munition-ajax', function(req, res, next) {
    let data = req.body;
    let munitionId = parseInt(data.id);
    let deleteMunitionQuery = `DELETE FROM Munitions WHERE munitionId = ?`;

    // Run the query 
    db.pool.query(deleteMunitionQuery, [munitionId], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400); // Bad Request
        } else {
            res.sendStatus(204);  // No Content (Success)
        }
    });
});


app.post('/add-munition-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
  
    // Capture NULL values (if your software allows it)
    let specs = data.specs || 'NULL'; // Assuming it's OK for specs to be 'NULL'
    let quantity = parseInt(data.quantity) || 'NULL'; // Assuming database allows string 'NULL'
  
    // Create the query and run it on the database
    let query1 = `INSERT INTO Munitions (type, specs, quantity) VALUES (?, ?, ?)`;
  
    db.pool.query(query1, [data.type, specs, quantity], function(error, results, fields) {
      if (error) {
        console.error("Error adding munition:", error);
        res.sendStatus(400);
      } else {
        query2 = `SELECT * FROM Munitions;`;
        db.pool.query(query2, function(error, rows, fields) {
          if (error) { 
            console.error("Error in Query 2:", error);
            res.sendStatus(400);
          } else {
            res.send(rows);
          }
        }) 
      }
    })
});  
  



// New route for navigating to Personnel.hbs
app.get('/Personnel', function(req, res)
{  
    let query1 = "SELECT * FROM Personnel;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('Personnel', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

// New route for navigating to MunitionsOrders.hbs
app.get('/MunitionsOrders', function(req, res)
{  
    let query1 = "SELECT * FROM MunitionsOrders;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('MunitionsOrders', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

// New route for navigating to MunitionTransactions.hbs
app.get('/MunitionTransactions', function(req, res)
{  
    let query1 = "SELECT * FROM MunitionTransactions;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('MunitionTransactions', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

// New route for navigating to BaseMunitions.hbs
app.get('/BaseMunitions', function(req, res)
{  
    let query1 = "SELECT * FROM BaseMunitions;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('BaseMunitions', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

// New route for navigating to PersonnelMunitions.hbs
app.get('/PersonnelMunitions', function(req, res)
{  
    let query1 = "SELECT * FROM PersonnelMunitions;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('PersonnelMunitions', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
