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
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  hostedZoneName: process.env.CDK_HOSTED_ZONE_NAME!,
  subdomain: process.env.CDK_SUBDOMAIN!,
});
console.log('\x1b[32m%s\x1b[0m', '\nenv settings:');
console.log(
  '\x1b[33m%s\x1b[0m',
  `${process.env.CDK_DEFAULT_ACCOUNT} in ${process.env.CDK_DEFAULT_REGION}`
);
console.log(
  '\x1b[33m%s\x1b[0m',
  `${process.env.CDK_SUBDOMAIN}.${process.env.CDK_HOSTED_ZONE_NAME}\n`
);
