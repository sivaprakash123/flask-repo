data = {
  "Request": {
    "RequestInfo": {
      "apiId": "Rainmaker",
      "ver": ".01",
      "ts": "",
      "action": "_estimate",
      "did": "1",
      "key": "",
      "msgId": "20170310130900|en_IN",
      "authToken": "c0f5fb4b-6441-447d-9b27-39bded3d0773"
    },
    "CalculationCriteria": [{
      "assessmentYear": "2018-19",
      "tenantId": "pb.zirakpur",
      "property": {
        "tenantId": "pb.zirakpur",
        "address": {
          "city": "Zirakpur",
          "locality": {
            "code": "ZRK_2",
            "area": "AREA1"
          }
        },
        "propertyDetails": [{
          "usageCategoryMinor": null,
          "units": [{
            "floorNo": "0",
            "usageCategoryMinor": "COMMERCIAL",
            "usageCategoryMajor": "NONRESIDENTIAL",
            "usageCategoryDetail": "MARRIAGEPALACE",
            "usageCategorySubMinor": "EVENTSPACE",
            "occupancyType": "SELFOCCUPIED",
            "unitArea": 100
          }, {
            "floorNo": "1",
            "usageCategoryMinor": null,
            "usageCategoryMajor": "RESIDENTIAL",
            "occupancyType": "SELFOCCUPIED",
            "unitArea": 100
          }],
          "usageCategoryMajor": "MIXED",
          "propertySubType": "INDEPENDENTPROPERTY",
          "landArea": "100",
          "buildUpArea": null,
          "propertyType": "BUILTUP",
          "noOfFloors": 2,
          "subOwnershipCategory": "SINGLEOWNER",
          "ownershipCategory": "INDIVIDUAL",
          "owners": [{
            "document": {
              "documentUid": null,
              "documentType": null
            },
            "name": "Tarun Lalwani",
            "mobileNumber": "9999405321",
            "fatherOrHusbandName": "None",
            "emailId": "tarunlalwani@gmail.com",
            "permanentAddress": "CC-50-B, Shalimar Bagh",
            "relationship": "father",
            "ownerType": "NONE",
            "gender": "Male"
          }],
          "financialYear": "2018-19"
        }]
      }
    }]
  },
  "Response": {
    "ResponseInfo": {
      "apiId": null,
      "ver": null,
      "ts": null,
      "resMsgId": null,
      "msgId": null,
      "status": null
    },
    "Calculation": [{
      "tenantId": "pb.zirakpur",
      "totalAmount": 460.00,
      "taxAmount": 510.00,
      "exemption": 0.00,
      "rebate": 50.00,
      "penalty": 0.00,
      "serviceNumber": null,
      "fromDate": 1522540800000,
      "toDate": 1554076799000,
      "taxHeadEstimates": [{
        "taxHeadCode": "PT_TAX",
        "estimateAmount": 500.00,
        "category": "TAX"
      }, {
        "taxHeadCode": "PT_UNIT_USAGE_EXEMPTION",
        "estimateAmount": 0.00,
        "category": "EXEMPTION"
      }, {
        "taxHeadCode": "PT_OWNER_EXEMPTION",
        "estimateAmount": 0.00,
        "category": "EXEMPTION"
      }, {
        "taxHeadCode": "PT_FIRE_CESS",
        "estimateAmount": 0.00,
        "category": "TAX"
      }, {
        "taxHeadCode": "PT_CANCER_CESS",
        "estimateAmount": 10.00,
        "category": "TAX"
      }, {
        "taxHeadCode": "PT_TIME_REBATE",
        "estimateAmount": 50.00,
        "category": "REBATE"
      }, {
        "taxHeadCode": "PT_TIME_PENALTY",
        "estimateAmount": 0.00,
        "category": "PENALTY"
      }, {
        "taxHeadCode": "PT_TIME_INTEREST",
        "estimateAmount": 0.00,
        "category": "PENALTY"
      }]
    }]
  }
}

data2 = {
  "Request": {
    "RequestInfo": {
      "apiId": "Rainmaker",
      "ver": ".01",
      "ts": "",
      "action": "_create",
      "did": "1",
      "key": "",
      "msgId": "20170310130900|en_IN",
      "authToken": "571c3a54-c8f4-4e20-bb29-b699253c57c7"
    },
    "Properties": [{
      "tenantId": "pb.amritsar",
      "address": {
        "city": "Amritsar",
        "locality": {
          "code": "SUN04",
          "area": "Area1"
        }
      },
      "propertyDetails": [{
        "usageCategoryMinor": null,
        "units": [{
          "floorNo": "0",
          "usageCategoryMinor": "COMMERCIAL",
          "usageCategoryMajor": "NONRESIDENTIAL",
          "usageCategoryDetail": "PHARMACY",
          "usageCategorySubMinor": "RETAIL",
          "occupancyType": "SELFOCCUPIED",
          "unitArea": 100
        }, {
          "floorNo": "1",
          "usageCategoryMinor": null,
          "usageCategoryMajor": "RESIDENTIAL",
          "occupancyType": "RENTED",
          "unitArea": 100,
          "arv": "90000"
        }],
        "usageCategoryMajor": "MIXED",
        "propertySubType": "INDEPENDENTPROPERTY",
        "landArea": "100",
        "buildUpArea": null,
        "propertyType": "BUILTUP",
        "noOfFloors": 2,
        "subOwnershipCategory": "SINGLEOWNER",
        "ownershipCategory": "INDIVIDUAL",
        "owners": [{
          "documents": [{
            "documentUid": null,
            "documentType": null
          }],
          "name": "Tarun Lalwani",
          "mobileNumber": "9999405321",
          "fatherOrHusbandName": "None",
          "emailId": "tarunlalwani@gmail.com",
          "permanentAddress": "CC-50-B, Shalimar Bagh",
          "relationship": "father",
          "ownerType": "NONE",
          "gender": "Male"
        }],
        "financialYear": "2018-19"
      }]
    }]
  },
  "Response": {
    "ResponseInfo": {
      "apiId": "Rainmaker",
      "ver": ".01",
      "ts": null,
      "resMsgId": "uief87324",
      "msgId": "20170310130900|en_IN",
      "status": "successful"
    },
    "Properties": [{
      "auditDetails": {
        "createdBy": "21a9d6d1-5b4c-485c-93b1-3a228241e564",
        "lastModifiedBy": "21a9d6d1-5b4c-485c-93b1-3a228241e564",
        "createdTime": 1537089089905,
        "lastModifiedTime": 1537089089905
      },
      "creationReason": null,
      "occupancyDate": null,
      "propertyDetails": [{
        "institution": null,
        "tenantId": "pb.amritsar",
        "citizenInfo": {
          "isPrimaryOwner": null,
          "ownerShipPercentage": null,
          "ownerType": null,
          "institutionId": null,
          "documents": null,
          "relationship": null,
          "id": 23344,
          "uuid": "21a9d6d1-5b4c-485c-93b1-3a228241e564",
          "userName": "9999405321",
          "password": null,
          "salutation": null,
          "name": "Tarun Lalwani",
          "gender": null,
          "mobileNumber": "9999405321",
          "emailId": "tarunlalwani@gmail.com",
          "altContactNumber": null,
          "pan": null,
          "aadhaarNumber": null,
          "permanentAddress": null,
          "permanentCity": null,
          "permanentPinCode": null,
          "correspondenceCity": null,
          "correspondencePinCode": null,
          "correspondenceAddress": null,
          "active": null,
          "dob": null,
          "pwdExpiryDate": null,
          "locale": null,
          "type": "CITIZEN",
          "signature": null,
          "accountLocked": null,
          "roles": [{
            "id": 281,
            "name": "Citizen",
            "code": "CITIZEN",
            "description": null,
            "createdBy": null,
            "createdDate": null,
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "tenantId": null
          }],
          "fatherOrHusbandName": null,
          "bloodGroup": null,
          "identificationMark": null,
          "photo": null,
          "createdBy": null,
          "createdDate": null,
          "lastModifiedBy": null,
          "lastModifiedDate": null,
          "otpReference": null,
          "tenantId": "pb"
        },
        "source": null,
        "usage": null,
        "noOfFloors": 2,
        "landArea": 100,
        "buildUpArea": null,
        "units": [{
            "id": "1664f426-9339-4f3d-9eb7-9a391b079f41",
            "tenantId": "pb.amritsar",
            "floorNo": "0",
            "unitType": null,
            "unitArea": 100,
            "usageCategoryMajor": "NONRESIDENTIAL",
            "usageCategoryMinor": "COMMERCIAL",
            "usageCategorySubMinor": "RETAIL",
            "usageCategoryDetail": "PHARMACY",
            "occupancyType": "SELFOCCUPIED",
            "occupancyDate": null,
            "constructionType": null,
            "constructionSubType": null,
            "arv": null
          },
          {
            "id": "d59537a2-415c-44f7-b293-af8ab1243384",
            "tenantId": "pb.amritsar",
            "floorNo": "1",
            "unitType": null,
            "unitArea": 100,
            "usageCategoryMajor": "RESIDENTIAL",
            "usageCategoryMinor": null,
            "usageCategorySubMinor": null,
            "usageCategoryDetail": null,
            "occupancyType": "RENTED",
            "occupancyDate": null,
            "constructionType": null,
            "constructionSubType": null,
            "arv": 90000
          }
        ],
        "documents": null,
        "additionalDetails": null,
        "financialYear": "2018-19",
        "propertyType": "BUILTUP",
        "propertySubType": "INDEPENDENTPROPERTY",
        "assessmentNumber": "AS-2018-09-16-002087",
        "assessmentDate": 1537089089911,
        "usageCategoryMajor": "MIXED",
        "usageCategoryMinor": null,
        "ownershipCategory": "INDIVIDUAL",
        "subOwnershipCategory": "SINGLEOWNER",
        "adhocExemption": null,
        "adhocPenalty": null,
        "adhocExemptionReason": null,
        "adhocPenaltyReason": null,
        "owners": [{
          "isPrimaryOwner": null,
          "ownerShipPercentage": null,
          "ownerType": "NONE",
          "institutionId": null,
          "documents": [{
            "id": "b71a2719-6d1b-451f-aa1f-7c5c2fdb1793",
            "documentType": null,
            "fileStore": null,
            "documentUid": null
          }],
          "relationship": null,
          "id": 23344,
          "uuid": "21a9d6d1-5b4c-485c-93b1-3a228241e564",
          "userName": "9999405321",
          "password": null,
          "salutation": null,
          "name": "Tarun Lalwani",
          "gender": "Male",
          "mobileNumber": "9999405321",
          "emailId": "tarunlalwani@gmail.com",
          "altContactNumber": null,
          "pan": null,
          "aadhaarNumber": null,
          "permanentAddress": "CC-50-B, Shalimar Bagh",
          "permanentCity": null,
          "permanentPinCode": null,
          "correspondenceCity": null,
          "correspondencePinCode": null,
          "correspondenceAddress": null,
          "active": true,
          "dob": null,
          "pwdExpiryDate": null,
          "locale": null,
          "type": "CITIZEN",
          "signature": null,
          "accountLocked": null,
          "roles": [{
            "id": null,
            "name": "Citizen",
            "code": "CITIZEN",
            "description": null,
            "createdBy": null,
            "createdDate": null,
            "lastModifiedBy": null,
            "lastModifiedDate": null,
            "tenantId": null
          }],
          "fatherOrHusbandName": "None",
          "bloodGroup": null,
          "identificationMark": null,
          "photo": null,
          "createdBy": "21a9d6d1-5b4c-485c-93b1-3a228241e564",
          "createdDate": 1537089090113,
          "lastModifiedBy": "21a9d6d1-5b4c-485c-93b1-3a228241e564",
          "lastModifiedDate": 1537089090113,
          "otpReference": null,
          "tenantId": "pb.amritsar"
        }],
        "auditDetails": {
          "createdBy": "21a9d6d1-5b4c-485c-93b1-3a228241e564",
          "lastModifiedBy": "21a9d6d1-5b4c-485c-93b1-3a228241e564",
          "createdTime": 1537089089905,
          "lastModifiedTime": 1537089089905
        },
        "calculation": {
          "serviceNumber": "AS-2018-09-16-002087",
          "totalAmount": 3700,
          "taxAmount": 4070,
          "penalty": 0,
          "exemption": 0,
          "rebate": 370,
          "fromDate": 1522540800000,
          "toDate": 1554076799000,
          "tenantId": "pb.amritsar",
          "taxHeadEstimates": [{
              "taxHeadCode": "PT_TAX",
              "estimateAmount": 3700,
              "category": "TAX"
            },
            {
              "taxHeadCode": "PT_UNIT_USAGE_EXEMPTION",
              "estimateAmount": 0,
              "category": "EXEMPTION"
            },
            {
              "taxHeadCode": "PT_OWNER_EXEMPTION",
              "estimateAmount": 0,
              "category": "EXEMPTION"
            },
            {
              "taxHeadCode": "PT_FIRE_CESS",
              "estimateAmount": 185,
              "category": "TAX"
            },
            {
              "taxHeadCode": "PT_CANCER_CESS",
              "estimateAmount": 185,
              "category": "TAX"
            },
            {
              "taxHeadCode": "PT_TIME_REBATE",
              "estimateAmount": 370,
              "category": "REBATE"
            },
            {
              "taxHeadCode": "PT_TIME_PENALTY",
              "estimateAmount": 0,
              "category": "PENALTY"
            },
            {
              "taxHeadCode": "PT_TIME_INTEREST",
              "estimateAmount": 0,
              "category": "PENALTY"
            }
          ]
        },
        "channel": null
      }],
      "propertyId": "PT-107-001802",
      "tenantId": "pb.amritsar",
      "acknowldgementNumber": "PB-AC-2018-09-16-001812",
      "oldPropertyId": null,
      "status": "ACTIVE",
      "address": {
        "id": "43c8cb0e-07c2-475b-be7c-93e48f84b277",
        "tenantId": "pb.amritsar",
        "latitude": null,
        "longitude": null,
        "addressId": null,
        "addressNumber": null,
        "type": null,
        "addressLine1": null,
        "addressLine2": null,
        "landmark": null,
        "doorNo": null,
        "city": "Amritsar",
        "pincode": null,
        "detail": null,
        "buildingName": null,
        "street": null,
        "locality": {
          "code": "SUN04",
          "name": "Ajit Nagar - Area1",
          "label": "Locality",
          "latitude": null,
          "longitude": null,
          "area": "Area1",
          "children": [],
          "materializedPath": null
        }
      }
    }]
  }
}
module.exports = data;