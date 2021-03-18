const express = require('express');
const app = express();
const request = require('request');
const port = 3000;

const empUrl = "http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees";

// Static file path
app.use(express.static(__dirname+'/public'));
// Html or rending Path
app.set('views', './src/views');
// View engine specification
app.set('view engine', 'ejs');


function getEmployeesData(url) {
    // Setting URL and headers for request
    var options = {
        url: empUrl,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}
// Weather Api Route
app.get('/',(req,res) => {
    var dataPromise = getEmployeesData();
    // Get user details after that get followers from URL
    dataPromise.then(JSON.parse)
               .then(function(result) {
                    res.render('main',{result,title:'***Employee Data***'})
                })
})

// //Weather Api Without promise
// app.get('/weatherwithoutpromise',(req,res) => {
//     request(url, (err,response,body) =>{
//         if(err){
//             console.log(err);
//         } else {
           
//             const output = JSON.parse(body);
//             res.send(output);
//         }
//     });
// });

app.listen(port ,(err) => {
    if(err) { console.log('error in api call')}
    else{ console.log ('App is running on port '+port)}
})