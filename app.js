//Initial setup
var express = require('express');
const {dbconn, dbstmt} = require('idb-connector');
var app = express();
var port = 3005;
//setup for https usage
var https = require('https')
var fs = require('fs')

// Try defining nav as a constant here rather than on each route
app.locals.navlinks = [{Link : '/passgen', Text: 'Password Generator'}]

//Define routers for different sub-domains
var Passwordrouter = require('./src/routes/passgen');

//Import certificates
const serverOptions = {
 key: fs.readFileSync('certs/privatekey.pem'),
 cert: fs.readFileSync('certs/certificate.pem')
};

//Setup static directory to find resources
app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap'));
app.use(express.static('node_modules/jquery'));

app.set('views','./src/views');
app.set('view engine', 'ejs');

//Look at request that comes in

app.use('/passgen', Passwordrouter)

// handle default domain request
app.get('/', function(req, res){

    // Gather up to 3 social media links from STAFFSM and return single record
    // including data from main staff table
    const sql = 'select STIDNO, STFORN, STSURN, STJOBT, STIMGN, ' +                           
    'SMDetails.FirstLink, SMDetails.FirstClass, ' +
    'SMDetails.SecondLink, SMDetails.SecondClass, ' +
    'SMDetails.ThirdLink, SMDetails.ThirdClass ' +
    'from shearsd.staff ' +
    'left outer join (select smidno, ' +
    'MAX(CASE WHEN LINKNO = 1 then SMLINK END) as FirstLink, ' +
    'MAX(CASE WHEN LINKNO = 1 then SMIMGN END) as FirstClass, ' +
    'MAX(CASE WHEN LINKNO = 2 then SMLINK END) as SecondLink, ' +
    'MAX(CASE WHEN LINKNO = 2 then SMIMGN END) as SecondClass, ' +
    'MAX(CASE WHEN LINKNO = 3 then SMLINK END) as ThirdLink, ' +
    'MAX(CASE WHEN LINKNO = 3 then SMIMGN END) as ThirdClass ' +
    'FROM (Select smidno, smlink, smimgn, row_number() Over (partition ' +
    'by smidno order by smlink) as LINKNO from shearsd.staffsm) SMDets ' +
    'Group by SMIDNO) SMDetails on SMDetails.SMIDNO = STIDNO';
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);

    statement.exec(sql, (x,error) => {
        if (error){
            throw error;
        }
      //  console.log((x));
        statement.close();
        connection.disconn();
        connection.close();

        res.render('index', { 
            nav: req.app.locals.navlinks,

        staff : (x)

        } );

    } );
});

//https version of the listen
https.createServer(serverOptions, app).listen(port, function(err){
    console.log('The server is running on port: ' + port);
});