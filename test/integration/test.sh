#!/bin/bash

# default to testing locally, have you build system control this value
[[ -z $LOCAL_TESTING ]] && export LOCAL_TESTING=1
[[ -z $DEBUG ]] && export DEBUG=aws-mocks

printf "\nRunning integration tests on $LOCAL_TESTING\n"

if [ "$LOCAL_TESTING" = "1" ]; then

    printf "\nDoing local integration testing\n"

    # Set values for local testing
    [[ -z $ROUTE53_HOST ]] && export ROUTE53_HOST='localhost'
    # when these values are undefined AWS will connect to the services based on your profile
    [[ -z $ROUTE53_PORT ]] && export ROUTE53_PORT=3000
    [[ -z $ROUTE53_ENDPOINT ]] && export ROUTE53_ENDPOINT="http://$ROUTE53_HOST:$ROUTE53_PORT"
    # Note these values are usually grabbed from a CF stack when running against an AWS ENV
    # But you can set the values on your CI/CD as well
    [[ -z $HOSTED_ZONE_ID ]] && export HOSTED_ZONE_ID=XXXXXXXXXXXXXX
    [[ -z $DOMAIN ]] && export DOMAIN=lotusjs.org
    [[ -z $RECORD_TYPE ]] && export RECORD_TYPE=A
    [[ -z $AWS_REGION ]] && export AWS_REGION=us-west-2

    # Make sure service port is available
    printf "\nChecking if port $ROUTE53_PORT is available\n"

    service_port_usage="$(lsof -i :$ROUTE53_PORT)"

    if ! [ -z "$service_port_usage" ]; then
        printf "Service port usage is:\n"
        printf "${service_port_usage}"
        printf "\n*** Port $ROUTE53_PORT is in use, unable to run test. Exiting. ***\n"
        exit 1;
    fi

    printf "\nStarting up service\n"

    # start the API using serverless
    nohup node test/mocks/Route53 &
    echo $!

    # store the process ID
    serverless_pid=$!

    # wait for service to start
    # https://unix.stackexchange.com/questions/5277/how-do-i-tell-a-script-to-wait-for-a-process-to-start-accepting-requests-on-a-po
    while ! echo exit | nc $ROUTE53_HOST $ROUTE53_PORT; do sleep 1; done

    # Add exit handler to kill processes on termination of the script
    trap "kill $serverless_pid" EXIT
fi

# run tests
grunt --dbug --stack mochaTest:integrationTest
MOCHA_RESULT=$?

printf "Finished running integration tests on $ROUTE53_HOST\n"

echo "Exiting: $MOCHA_RESULT"
exit $MOCHA_RESULT
