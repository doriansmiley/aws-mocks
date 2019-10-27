const express = require('express');
const app = express();
const port = 3000;
const debug = require('debug')('aws-mocks');

app.get('/2013-04-01/testdnsanswer', (req, res) => {
    // setup a handler for a valid domain. If your tests create domain you can add a mock for that as well
    // and load the created mock set here
    debug(req.query);
    switch (req.query.hostedzoneid) {
        case 'XXXXXXXXXXXXXX':
            if(req.query.recordname === 'lotusjs.org' && req.query.recordtype === 'A') {
                res.set('x-amzn-requestid', 'e5616dc7-32e4-46cc-9b89-5bf98968dc44');
                res.set('date', 'Sat, 26 Oct 2019 16:55:57 GMT');
                res.set('content-length', '507');
                res.set('content-type', 'text/xml');
                res.send('<?xml version="1.0"?>\n' +
                    '<TestDNSAnswerResponse xmlns="https://route53.amazonaws.com/doc/2013-04-01/"><Nameserver>ns-1715.awsdns-22.co.uk</Nameserver><RecordName>lotusjs.org</RecordName><RecordType>A</RecordType><RecordData><RecordDataEntry>99.86.230.90</RecordDataEntry><RecordDataEntry>99.86.230.71</RecordDataEntry><RecordDataEntry>99.86.230.112</RecordDataEntry><RecordDataEntry>99.86.230.95</RecordDataEntry></RecordData><ResponseCode>NOERROR</ResponseCode><Protocol>UDP</Protocol></TestDNSAnswerResponse>');
            }
            break;
        default:
            res.set('x-amzn-requestid', 'e5616dc7-32e4-46cc-9b89-5bf98968dc44');
            res.set('date', 'Sat, 26 Oct 2019 16:55:57 GMT');
            res.set('content-length', '315');
            res.set('content-type', 'text/xml');
            res.send('<?xml version="1.0"?>\n' +
                '<ErrorResponse xmlns="https://route53.amazonaws.com/doc/2013-04-01/"><Error><Type>Sender</Type><Code>InvalidInput</Code><Message>Record name \''+req.params.recordname+'\' is not valid for hosted zone: lotusjs.org.</Message></Error><RequestId>091e79d3-009c-4823-a294-7e14bc9b3873</RequestId></ErrorResponse>');

    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
