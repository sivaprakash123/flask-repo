var express = require('express'),
    slash = require('express-slash');
var bodyParser = require('body-parser')

var request = require('request-promise');
const {
    asyncMiddleware
} = require('./utils/asyncMiddleware');

var app = express();
const PT_DEBUG_MODE = Boolean(process.env.PT_DEBUG_MODE) || false;
const PT_HOST = process.env.PT_HOST

if (PT_HOST === undefined) {
    throw Error("PT_HOST environment variable needs to be configured to run this")
}

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
    strict: app.get('strict routing')
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
    res.sendFile(path.join(__dirname + '/templates/apicall.html'));
});

router.post('/protected/reports/lmereport', function (req, res) {
    let userId = String(req.body.RequestInfo.userInfo.id);

    console.log("User id is", userId);
    db.any(query, userId).then(function (data) {
        console.log(data)
    })

    var excel = require('excel4node');

    var workbook = new excel.Workbook();

    var worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.cell(1, 1).string('content for display');

    workbook.write('report.xlsx', res);
});

data = require('./sampleRequest')

function getFireCessPercentage(propertyDetails) {
    // let propertyDetails = request["CalculationCriteria"][0]["propertyDetails"][0]

    let propertyUsageCategoryMajor = propertyDetails["usageCategoryMajor"]
    let units = propertyDetails["units"]
    let propertyAttributes = propertyDetails["additionalDetails"]["propertyAttributes"]
    let unitSet = new Set()

    for (unit of units) {
        unitSet.add(unit["usageCategoryMajor"])
    }
    let firecess_category_major = 0;
    let firecess_building_height = 0;
    let firecess_inflammable = 0;

    if (propertyUsageCategoryMajor == "RESIDENTIAL" || (unitSet.size == 1 && unitSet.has("RESIDENTIAL"))) {
        // There is no category major firecess applicable as it i
        firecess_category_major = 0
    } else {
        firecess_category_major = 5.0
    }

    if (propertyAttributes.HEIGHTABOVE36FEET && propertyAttributes.HEIGHTABOVE36FEET.toString() == "true") {
        // height is above 36 feet
        firecess_building_height = 2.0
    }

    if (propertyAttributes.INFLAMMABLE && propertyAttributes.INFLAMMABLE.toString() == "true") {
        // height is above 36 feet
        firecess_inflammable = 10.0
    }

    return {
        firecess_inflammable,
        firecess_building_height,
        firecess_category_major,
        firecess: firecess_category_major + firecess_building_height + firecess_inflammable
    }
}

function calculateNewFireCess(taxHeads, firecess_percent, taxField, taxHeadCodeField) {

    let applicablePropertyTax = 0
    for (taxHead of taxHeads) {
        if (taxHead[taxHeadCodeField] == "PT_TAX") {
            applicablePropertyTax += taxHead[taxField]
        } else if (taxHead[taxHeadCodeField] == "PT_UNIT_USAGE_EXEMPTION") {
            applicablePropertyTax -= taxHead[taxField]
        } else if (taxHead[taxHeadCodeField] == "PT_OWNER_EXEMPTION") {
            applicablePropertyTax -= taxHead[taxField]
        }
    }

    return applicablePropertyTax * (firecess_percent / 100);
}

async function findDemandForConsumerCode(consumerCode, tenantId, service, RequestInfo) {
    let demandSearchResponse = await request.post({
        url: PT_HOST + "/billing-service/demand/_search?tenantId=" + tenantId +
            "&consumerCode=" + consumerCode + "&businessService=" + service,
        body: {
            RequestInfo
        },
        json: true
    })

    return demandSearchResponse;
}

async function updateDemand(demands, RequestInfo) {
    let demandUpdateResponse = await request.post({
        url: PT_HOST + "/billing-service/demand/_update",
        body: {
            RequestInfo,
            "Demands": demands
        },
        json: true
    })

    return demandUpdateResponse;
}

function _estimateTaxProcessor(request, response) {
    let index = 0;
    for (let calc of request["CalculationCriteria"]) {
        let fireCessPercentage = getFireCessPercentage(calc["property"]["propertyDetails"][0])
        console.log(fireCessPercentage)

        let newTaxAmount = calculateNewFireCess(response["Calculation"][0]["taxHeadEstimates"], fireCessPercentage.firecess, "estimateAmount", "taxHeadCode")
        console.log(newTaxAmount);

        for (taxHead of response["Calculation"][index]["taxHeadEstimates"]) {
            if (taxHead.taxHeadCode == "PT_FIRE_CESS") {
                let existingTaxAmount = taxHead.estimateAmount
                taxHead.estimateAmount = newTaxAmount
                if (PT_DEBUG_MODE) {
                    taxHead.oldEstimateAmount = existingTaxAmount
                    taxHead.firecess = fireCessPercentage
                }
                let deltaTax = newTaxAmount - existingTaxAmount
                response["Calculation"][index]["totalAmount"] += deltaTax
                response["Calculation"][index]["taxAmount"] += deltaTax
                break
            }
        }
        index++;
    }

    return response;
}

async function _createAndUpdateTaxProcessor(request, response) {
    let index = 0
    for (reqProperty of request["Properties"]) {
        
        let resProperty = response["Properties"][index]
        let propertyId = resProperty["propertyId"]

        let assessmentNumber = resProperty["propertyDetails"][0]["assessmentNumber"]

        let consumerCode = propertyId + ":" + assessmentNumber
        let service = "PT"
        let tenantId = reqProperty["tenantId"]

        let demandSearchResponse = await findDemandForConsumerCode(consumerCode, tenantId, service, request["RequestInfo"])
        console.log(demandSearchResponse);

        let fireCessPercentage = getFireCessPercentage(reqProperty["propertyDetails"][0])
        console.log(fireCessPercentage);
        if (PT_DEBUG_MODE) {
            demandSearchResponse["Demands"][0]["firecess"] = fireCessPercentage
        }

        for (let demand of demandSearchResponse["Demands"][0]["demandDetails"]) {
            if (demand.taxHeadMasterCode == "PT_FIRE_CESS") {
                let existingTaxAmount = demand.taxAmount
                let newTaxAmount = calculateNewFireCess(demandSearchResponse["Demands"][0]["demandDetails"], fireCessPercentage.firecess, "taxAmount", "taxHeadMasterCode")
                demand.taxAmount = newTaxAmount
                let deltaTax = newTaxAmount - existingTaxAmount;

                let calc = response["Properties"][index]["propertyDetails"][0]["calculation"]

                calc.totalAmount += deltaTax
                calc.taxAmount += deltaTax

                for (let taxHead of calc["taxHeadEstimates"]) {
                    if (taxHead.taxHeadCode == "PT_FIRE_CESS") {
                        taxHead.estimateAmount = newTaxAmount
                        if (PT_DEBUG_MODE) {
                            taxHead.firecess = fireCessPercentage
                            taxHead.oldEstimateAmount = existingTaxAmount
                        }
                        break
                    }
                }
                break
            }
        }
        console.log(demandSearchResponse["Demands"])
        let demandUpdateResponse = await updateDemand(demandSearchResponse["Demands"], request["RequestInfo"])
        console.log(demandUpdateResponse);
        index++
    }

    return response
}

async function _createAndUpdateRequestHandler(req, res) {
    let request = req.body.Request
    let response = req.body.Response
    let updatedResponse = await _createAndUpdateTaxProcessor(request, response)
    res.json(updatedResponse);
}

router.post('/protected/punjab-pt/property/_create', asyncMiddleware(_createAndUpdateRequestHandler))

router.post('/protected/punjab-pt/property/_update', asyncMiddleware(_createAndUpdateRequestHandler))

router.post('/protected/punjab-pt/pt-calculator-v2/_estimate', function (req, res) {
    let request = req.body.Request
    let response = req.body.Response
    let updatedResponse = _estimateTaxProcessor(request, response)
    res.json(updatedResponse);
})

app.listen(8000, () => {
    console.log("Listening on port 8000")
});

// TODO:
// Add total amount to calculations                "totalAmount": 460,
//  "taxAmount": 510,