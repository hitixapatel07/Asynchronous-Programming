
var fs = require('fs');
var util = require('util');

const express = require('express');

//const router = express.Router();
const fetch = require("node-fetch");


var app = express(); //started the server
 app.get('/',(req,res) => {
    let template = `<div>
    <h1 style='color: blue;'>Welcome to Home Page</h1>
    <ul><li> Employee data <b> http://localhost:3000/employee/:id </b></li>
    <li>Project data <b> http://localhost:3000/project/:id </b><li>
    <li>All employees details :<b> <a href='/getemployeedetails'> http://localhost:3000/getemployeedetails</a></b></li>
    <li>specific employee details:<b> http://localhost:3000/getemployeedetails/:id </b></li></ul>
  </div>`;

  res.send(template);
    
})
app.get('/employee/:id', (req, res) => {
    console.log(req.params.id);
    console.log(req.method);

    fs.readFile('employee.json', function (err, data) {
        if (!err) {
            const empData = JSON.parse(data);
            console.log(empData);
            for (let i = 0; i < empData.employees.length; i++) {
                console.log(typeof req.params.id);
                if (empData.employees[i].id == req.params.id) {
                    res.json(empData.employees[i])
                    return;
                }

            }
        } else {
            console.log(err);
            res.send('Unable to read the data');
        }
    });
});

app.get('/project/:pId', (req, res) => {
    console.log(req.params.pId);
    console.log(req.method);

    fs.readFile('project.json', function (err, data) {
        if (!err) {
            const projectData = JSON.parse(data);
            console.log(projectData);
            for (let i = 0; i < projectData.projects.length; i++) {
                console.log(typeof req.params.pId);
                if (projectData.projects[i].pId == req.params.pId) {
                    res.json(projectData.projects[i])
                    return;
                }

            }
        } else {
            console.log(err);
            res.send('Unable to read the data');
        }
    });
});

app.get('/getemployeedetails', (req, res) => {

    var read = util.promisify(fs.readFile);

    Promise.all([read('employee.json'),
    read('project.json')])
        .then(data => {
            const [data1, data2] = data;
          
            const emp = JSON.parse(data1);
            
            const prjct = JSON.parse(data2);
            
            
            for (let i = 0; i < emp.employees.length; i++) {
               for(let j = 0; j < prjct.projects.length; j++){
                if (emp.employees[i].pId == prjct.projects[j].pId) {
                    //res.json(userData.employees[i])
                    emp.employees[i].project = prjct.projects[j];
                    console.log(emp.employees[i]);
                }
               }  
            }

            res.json(emp.employees);
        });

});


app.get('/getemployeedetails/:id', function (req, res) {
    let id = req.params.id;
    fetch('http://localhost:3000/employee/' + id)
        .then(function (response) {
            return response.json();
        }).then(function (employee) {
            var pId = employee.pId;

            return fetch('http://localhost:3000/project/' + pId)
                .then(function (response) {
                    return response.json();
                }).then(function (project) {
                    employee.project = project;
                    return employee;
                }).catch(function (error) {
                    console.log(error);
                })

        }).then(function (employee) {
            res.send(employee);
        })
        .catch(function (error) {
            console.log(error);
        })
});

app.get('*', function(req, res){
    res.send('Page not found', 404);
  });

app.listen(3000);