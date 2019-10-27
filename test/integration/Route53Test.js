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
        let params;
        if( process.env.LOCAL_TESTING ) {
            params = {
                HostedZoneId: process.env.HOSTED_ZONE_ID,
                RecordName: process.env.DOMAIN,
                RecordType: process.env.RECORD_TYPE,
            }
        }
        const result = await  route53.testDNSAnswer(params).promise();
        debug(result);
        expect(result.RecordName).to.equal(process.env.DOMAIN);
        expect(result.RecordType).to.equal(process.env.RECORD_TYPE);
        expect(result.ResponseCode).to.equal('NOERROR');
    });

    it(`should fail to find a valid record for: anything ${process.env.DOMAIN} ${process.env.RECORD_TYPE}`, async ()=>{
        const route53 = new AWS.Route53({
            endpoint: process.env.ROUTE53_ENDPOINT,
            region: process.env.AWS_REGION
        });
        //test bad result
        try{
            const result = await  route53.testDNSAnswer({
                HostedZoneId: 'anything',
                RecordName: process.env.DOMAIN,
                RecordType: process.env.RECORD_TYPE,
            }).promise();
        } catch (e) {
            expect(e.message).to.equal('No hosted zone found with ID: anything');
        }
    });
});
