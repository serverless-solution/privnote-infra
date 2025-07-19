#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PrivnoteInfraStack } from '../lib/privnote-infra-stack';

if (!process.env.CDK_DEFAULT_ACCOUNT || !process.env.CDK_DEFAULT_REGION) {
  console.log(`activate your aws profile. see README`);
  process.exit(1);
}

if (!process.env.CDK_HOSTED_ZONE_NAME || !process.env.CDK_SUBDOMAIN) {
  console.log(`export required variables. see README`);
  process.exit(1);
}

// sleep here
const app = new cdk.App();
new PrivnoteInfraStack(app, 'PrivnoteInfraStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  // export CDK_HOSTED_ZONE_NAME=test.best-security.us && export CDK_SUBDOMAIN=privnote && cdk ls
  hostedZoneName: process.env.CDK_HOSTED_ZONE_NAME!,
  subdomain: process.env.CDK_SUBDOMAIN!,

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
console.log('\x1b[32m%s\x1b[0m', 'env settings:');
console.log('\x1b[33m%s\x1b[0m', `${process.env.CDK_DEFAULT_ACCOUNT} in ${process.env.CDK_DEFAULT_REGION}`);
console.log('\x1b[33m%s\x1b[0m', `${process.env.CDK_SUBDOMAIN}.${process.env.CDK_HOSTED_ZONE_NAME}`);
console.log('\x1b[32m%s\x1b[0m', 'stacks:');
