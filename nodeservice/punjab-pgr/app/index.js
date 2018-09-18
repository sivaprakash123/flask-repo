var express = require('express'),
    slash = require('express-slash');
var bodyParser = require('body-parser')

var request = require('request-promise');
const {
    asyncMiddleware
} = require('./utils/asyncMiddleware');

var app = express();
const PT_DEBUG_MODE = Boolean(process.env.PT_DEBUG_MODE) || false;
const PT_DEMAND_HOST = process.env.PT_DEMAND_HOST
const MDMS_HOST = process.env.MDMS_HOST

const TAX_TYPE = {
    PT_TAX: false,
    PT_TIME_REBATE: true,
    PT_UNIT_USAGE_EXEMPTION: true,
    PT_TIME_PENALTY: false,
    PT_CANCER_CESS: false,
    PT_ADHOC_PENALTY: false,
    PT_ADHOC_REBATE: true,
    PT_DECIMAL_CEILING_CREDIT: false,
    PT_DECIMAL_CEILING_DEBIT: true,
    PT_FIRE_CESS: false,
    PT_OWNER_EXEMPTION: true,
    PT_TIME_INTEREST: false
}

if (PT_DEMAND_HOST === undefined) {
    throw Error("PT_HOST environment variable needs to be configured to run this")
}

function round(num, digits) {
    return parseFloat(parseFloat(num).toFixed(digits))
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
    let propertyAttributes = propertyDetails["additionalDetails"]
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

    if (propertyAttributes &&
        propertyAttributes.heightAbove36Feet &&
        propertyAttributes.heightAbove36Feet.toString() == "true") {
        // height is above 36 feet
        firecess_building_height = 2.0
    }

    if (propertyAttributes &&
        propertyAttributes.inflammable &&
        propertyAttributes.inflammable.toString() == "true") {
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

    return round(applicablePropertyTax * (firecess_percent / 100), 2);
}

async function findDemandForConsumerCode(consumerCode, tenantId, service, RequestInfo) {
    let demandSearchResponse = await request.post({
        url: PT_DEMAND_HOST + "/billing-service/demand/_search?tenantId=" + tenantId +
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
        url: PT_DEMAND_HOST + "/billing-service/demand/_update",
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

        let updateFirecessAmount = calculateNewFireCess(response["Calculation"][0]["taxHeadEstimates"], fireCessPercentage.firecess, "estimateAmount", "taxHeadCode")
        console.log(updateFirecessAmount)

        let taxes = getUpdateTaxSummary(response["Calculation"][index], updateFirecessAmount, "taxHeadCode", "estimateAmount")

        response["Calculation"][index]["totalAmount"] = taxes.totalAmount
        response["Calculation"][index]["taxAmount"] = round(taxes.taxAmount, 2)
        response["Calculation"][index]["rebate"] = taxes.rebate

        index++
    }

    return response;
}

function getUpdateTaxSummary(calculation, newTaxAmount, taxHeadCodeField, taxAmountField) {
    let ceilingTaxHead = null;
    let firecessTaxHead = null;

    let taxAmount = 0,
        penalty = 0,
        rebate = 0,
        exemption = 0
    let taxHeads = calculation["taxHeadEstimates"]
    for (taxHead of taxHeads) {
        if (taxHead[taxHeadCodeField] == "PT_FIRE_CESS") {
            let existingTaxAmount = taxHead[taxAmountField]
            taxHead[taxAmountField] = newTaxAmount
            firecessTaxHead = taxHead
            taxAmount += newTaxAmount
            if (PT_DEBUG_MODE) {
                taxHead.oldEstimateAmount = existingTaxAmount
            }
        } else {
            switch (taxHead[taxHeadCodeField]) {
                case "PT_DECIMAL_CEILING_CREDIT":
                case "PT_DECIMAL_CEILING_DEBIT":
                    ceilingTaxHead = taxHead
                    break
                case "PT_ADVANCE_CARRYFORWARD":
                    exemption += taxHead[taxAmountField]
                    break
                default:
                    switch (taxHead.category) {
                        case "PENALTY":
                            penalty += taxHead[taxAmountField]
                            break
                        case "TAX":
                            taxAmount += taxHead[taxAmountField]
                            break
                        case "REBATE":
                            rebate += taxHead[taxAmountField]
                            break
                        case "EXEMPTION":
                            exemption += taxHead[taxAmountField]
                            break
                        default:
                            console.log("Going to default for taxHead", taxHead)
                            taxAmount += taxHead[taxAmountField]
                    }

            }
        }
    }

    taxAmount = round(taxAmount, 2)
    penalty = round(penalty, 2)
    exemption = round(exemption, 2)
    rebate = round(rebate, 2)

    let totalAmount = taxAmount + penalty - rebate - exemption

    console.log({
        taxAmount, penalty, rebate, exemption, totalAmount
    })

    totalAmount = round(totalAmount, 2)
    let fractionAmount = totalAmount - Math.trunc(totalAmount)
    let newCeilingTax = false


    if (ceilingTaxHead == null && fractionAmount == 0) {

    } else {
        let ceilingDelta = 0.0;

        if (ceilingTaxHead == null) {
            ceilingTaxHead = {
                taxHeadCode: "", estimateAmount:0, category: null
            }
            newCeilingTax = true
            taxHeads.push(ceilingTaxHead)
        }

        if (fractionAmount < 0.5) {
            ceilingDelta = parseFloat(fractionAmount.toFixed(2))
            totalAmount = Math.trunc(totalAmount)
            ceilingTaxHead[taxHeadCodeField] = "PT_DECIMAL_CEILING_DEBIT"
            ceilingTaxHead[taxAmountField] = ceilingDelta
            rebate += ceilingDelta
        } else {
            ceilingDelta = parseFloat((1 - fractionAmount).toFixed(2))

            totalAmount = Math.trunc(totalAmount) + 1
            ceilingTaxHead[taxHeadCodeField] = "PT_DECIMAL_CEILING_CREDIT"
            ceilingTaxHead[taxAmountField] = ceilingDelta
            taxAmount += ceilingDelta
        }
    }

    return {
        taxHeads,
        rebate,
        totalAmount,
        taxAmount,
        newCeilingTax,
        ceilingTaxHead,
        firecessTaxHead
    }
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
        let calc = response["Properties"][index]["propertyDetails"][0]["calculation"]
        let updateFirecessTax = calculateNewFireCess(calc["taxHeadEstimates"], fireCessPercentage.firecess, "estimateAmount", "taxHeadCode")

        let taxes = getUpdateTaxSummary(calc,
            updateFirecessTax, "taxHeadCode", "estimateAmount")

        console.log(demandSearchResponse["Demands"])

        if (taxes.newCeilingTax) {
            let firstDemand = demandSearchResponse["Demands"][0]["demandDetails"][0]
            let newDemand = {
                id: null,
                demandId: firstDemand["demandId"],
                taxHeadMasterCode: taxes.ceilingTaxHead.taxHeadCode,
                taxAmount: taxes.ceilingTaxHead.estimateAmount,
                tenantId: firstDemand["tenantId"],
                collectionAmount: 0
            }
            demandSearchResponse["Demands"][0]["demandDetails"].push(newDemand)
        }

        for (demandDetail of demandSearchResponse["Demands"][0]["demandDetails"]) {
            if (demandDetail.taxHeadMasterCode == "PT_FIRE_CESS") {
                demandDetail.taxAmount = taxes.firecessTaxHead.estimateAmount
            }
        }

        let demandUpdateResponse = await updateDemand(demandSearchResponse["Demands"], request["RequestInfo"])
        console.log(demandUpdateResponse)

        // let updateTaxHeads = []

        // for (taxHead of demandSearchResponse["Demands"]) {
        //     updateTaxHeads.push({
        //         taxHeadCode: taxHead.taxHeadMasterCode,
        //         estimateAmount: taxHead.taxtAmount,
        //         category: taxHead.category
        //     })
        // }

        calc["totalAmount"] = taxes.totalAmount
        calc["taxAmount"] = taxes.taxAmount
        calc["rebate"] = taxes.rebate
        // calc["taxHeadEstimates"] = updateTaxHeads
        index++
    }

    return response
}

async function _createAndUpdateRequestHandler(req, res) {
    let request = JSON.parse(req.body.request)
    let response = JSON.parse(req.body.response)
    // let request = req.body.request
    // let response = req.body.response

    console.log(request, response)

    let updatedResponse = await _createAndUpdateTaxProcessor(request, response)
    res.json(updatedResponse);
}

router.post('/protected/punjab-pt/property/_create', asyncMiddleware(_createAndUpdateRequestHandler))

router.post('/protected/punjab-pt/property/_update', asyncMiddleware(_createAndUpdateRequestHandler))

router.post('/protected/punjab-pt/pt-calculator-v2/_estimate', function (req, res) {
    let request = JSON.parse(req.body.request)
    let response = JSON.parse(req.body.response)
    // let request = req.body.request
    // let response = req.body.response
    console.log(request, response)

    let updatedResponse = _estimateTaxProcessor(request, response)
    res.json(updatedResponse);
})

app.listen(8000, () => {
    console.log("Listening on port 8000")
});

// TODO:
// Add total amount to calculations                "totalAmount": 460,
//  "taxAmount": 510,