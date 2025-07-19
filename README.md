# Welcome to your CDK TypeScript project

1. install [nvm](https://github.com/nvm-sh/nvm)
2. `nvm install v22`
3. `curl -s https://gist.githubusercontent.com/vasylherman/01371ad969507c72302784a5cce69d93/raw | bash`
4. `npm i`
5. `asp ud_test` [doc](https://github.com/ohmyzsh/ohmyzsh/blob/master/plugins/aws/README.md)
6. `aws sts get-caller-identity | cat` [doc](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
7. `export CDK_HOSTED_ZONE_NAME=test.best-security.us && export CDK_SUBDOMAIN=privnote`
8. `cdk ls`
9. `cdk bootstrap` bootstrap if asking

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
