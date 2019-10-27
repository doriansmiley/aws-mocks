const AWS = require('aws-sdk');
const debug = require('debug')('aws-mocks');

// eslint-disable-next-line no-undef
describe('Testing Handler', function() {
    // eslint-disable-next-line no-undef
    it('should return success response 200', async ()=>{
        const route53 = new AWS.Route53({
            endpoint: process.env.ROUTE53_ENDPOINT,
            region: 'us-west-2'
        });
        const result = await  route53.testDNSAnswer({
            HostedZoneId: 'anything',
            RecordName: 'lotusjs.org',
            RecordType: 'A',
        }).promise();
        debug(result);
    });
});
