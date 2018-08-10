var express = require('express'),
    slash   = require('express-slash');
var bodyParser = require('body-parser')


var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse application/json
app.use(bodyParser.json())

// Because you're the type of developer who cares about this sort of thing!
app.enable('strict routing');

// Create the router using the same routing options as the app.
var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});

// Add the `slash()` middleware after your app's `router`, optionally specify
// an HTTP status code to use when redirecting (defaults to 301).
app.use('/customization', router);
// app.use(slash());
app.use(express.json());

var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);

const connectionString = {
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    database: process.env.DB_NAME || 'db',
    user: process.env.DB_USER || 'pg_user',
    password: process.env.DB_PASSWORD || 'password'
};

console.log(connectionString);
// var connectionString = 'postgres://localhost:5432/egov_prod_db';
var db = pgp(connectionString);
var path = require('path');

query = `SELECT servicerequestid as complaint_no, servicecode as complaint_type, eg_user.name as citizen_name, eg_user.mobilenumber as citizen_mobile, address, landmark, description as details
FROM eg_pgr_service INNER JOIN eg_user ON eg_pgr_service.accountid = cast(eg_user.id as varchar)
WHERE eg_pgr_service.status = 'assigned' AND servicerequestid IN (select DISTINCT businesskey from eg_pgr_action where status = 'assigned' AND "when" 
IN (select max("when") from eg_pgr_action where assignee NOTNULL group by businesskey) AND assignee = $1);`

router.get('/open/reports/*', function (req, res) {
    console.log(req);
    res.sendFile(path.join(__dirname+'/templates/apicall.html'));
});

router.post('/protected/reports/lmereport', function (req, res) {
    console.log(req.body);
    console.log(req.data);
    console.log(req);

    var excel = require('excel4node');

    var workbook = new excel.Workbook();

    var worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.cell(1,1).string('content for display');

    workbook.write('report.xlsx', res);
});

app.listen(8000, () => {
    console.log("Listening on port 8000")
});