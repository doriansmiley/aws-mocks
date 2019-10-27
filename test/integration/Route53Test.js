const AWS = require('aws-sdk');
const debug = require('debug')('aws-mocks');

// eslint-disable-next-line no-undef
describe('Testing Handler', function() {
    // eslint-disable-next-line no-undef
    it(`should find a valid record for: ${process.env.HOSTED_ZONE_ID} ${process.env.DOMAIN} ${process.env.RECORD_TYPE}`, async ()=>{
        const route53 = new AWS.Route53({
            endpoint: process.env.ROUTE53_ENDPOINT,
            region: process.env.AWS_REGION
        });
        const result = await  route53.testDNSAnswer({
            HostedZoneId: process.env.HOSTED_ZONE_ID,
            RecordName: process.env.DOMAIN,
            RecordType: process.env.RECORD_TYPE,
        }).promise();
        debug(result);
        expect(JSON.stringify(result)).to.deep.equal('{"Nameserver":"ns-1715.awsdns-22.co.uk","RecordName":"lotusjs.org","RecordType":"A","RecordData":["99.86.230.90","99.86.230.71","99.86.230.112","99.86.230.95"],"ResponseCode":"NOERROR","Protocol":"UDP"}');
    });

    it(`should fail to find a valid record for: anything ${process.env.DOMAIN} ${process.env.RECORD_TYPE}`, async ()=>{
        const route53 = new AWS.Route53({
            endpoint: process.env.ROUTE53_ENDPOINT,
            region: process.env.AWS_REGION
        });
        //test bad result
        const result = await  route53.testDNSAnswer({
            HostedZoneId: 'anything',
            RecordName: process.env.DOMAIN,
            RecordType: process.env.RECORD_TYPE,
        }).promise();
        debug(result);
        expect(JSON.stringify(result)).to.deep.equal('{"RecordData":[]}');
    });
});
