const express = require('express');
const app = express();
const port = 3000;

app.get('/2013-04-01/testdnsanswer', (req, res) => {
    // 'x-amzn-requestid': 'e5616dc7-32e4-46cc-9b89-5bf98968dc44',
    // 'date': 'Sat, 26 Oct 2019 16:55:57 GMT', 'content-length': '507', 'content-type': 'text/xml'
    res.set('x-amzn-requestid', 'e5616dc7-32e4-46cc-9b89-5bf98968dc44');
    res.set('date', 'Sat, 26 Oct 2019 16:55:57 GMT');
    res.set('content-length', '507');
    res.set('content-type', 'text/xml');
    res.send('<?xml version="1.0"?>\n' +
        '<TestDNSAnswerResponse xmlns="https://route53.amazonaws.com/doc/2013-04-01/"><Nameserver>ns-1715.awsdns-22.co.uk</Nameserver><RecordName>lotusjs.org</RecordName><RecordType>A</RecordType><RecordData><RecordDataEntry>99.86.230.90</RecordDataEntry><RecordDataEntry>99.86.230.71</RecordDataEntry><RecordDataEntry>99.86.230.112</RecordDataEntry><RecordDataEntry>99.86.230.95</RecordDataEntry></RecordData><ResponseCode>NOERROR</ResponseCode><Protocol>UDP</Protocol></TestDNSAnswerResponse>')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
