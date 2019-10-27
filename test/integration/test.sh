#!/bin/bash
export LOCAL_TESTING=1

[[ -z $ROUTE53_HOST ]] && export ROUTE53_HOST='localhost'
[[ -z $ROUTE53_PORT ]] && export ROUTE53_PORT=3000
[[ -z $DEBUG ]] && export DEBUG=aws-mocks
[[ -z $ROUTE53_ENDPOINT ]] && export ROUTE53_ENDPOINT="http://$ROUTE53_HOST:$ROUTE53_PORT"

# Determine if testing locally
# if [ -z string ] True if the string is null (an empty string)
if [ -z $(echo "${ROUTE53_HOST}" | sed -n 's/^\(localhost\)/\1/p') ]; then
    LOCAL_TESTING=0
fi

printf "\nRunning integration tests on $ROUTE53_HOST\n"

if [ "$LOCAL_TESTING" = "1" ]; then

    printf "\nDoing local integration testing\n"

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
