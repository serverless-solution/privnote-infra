import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { CertificateValidation, Certificate } from 'aws-cdk-lib/aws-certificatemanager';

interface PrivnoteInfraProps extends cdk.StackProps {
  hostedZoneName: string;
  subdomain: string;
}

export class PrivnoteInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PrivnoteInfraProps) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.hostedZoneName,
    });

    const cert = new Certificate(this, 'DnsValidatedCertificate', {
      validation: CertificateValidation.fromDns(hostedZone),
      domainName: hostedZone.zoneName,
      subjectAlternativeNames: [`*.${hostedZone.zoneName}`],
    });
  }
}
