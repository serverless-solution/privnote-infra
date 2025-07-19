import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CertificateValidation, Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { AllowedMethods, CachePolicy, Distribution, OriginRequestPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CorsHttpMethod, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as path from 'node:path';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

interface PrivnoteInfraProps extends cdk.StackProps {
  hostedZoneName: string;
  subdomain: string;
  frontend: {
    VITE_APP_TEST: string;
  };
}

export class PrivnoteInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PrivnoteInfraProps) {
    super(scope, id, props);

    // common
    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.hostedZoneName,
    });

    const cert = new Certificate(this, 'DnsValidatedCertificate', {
      validation: CertificateValidation.fromDns(hostedZone),
      domainName: hostedZone.zoneName,
      subjectAlternativeNames: [`*.${hostedZone.zoneName}`],
    });

    // api
    const apiLambda = new NodejsFunction(this, 'apiLambda', {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(__dirname, './api-lambda/serverless.ts'),
      logRetention: RetentionDays.ONE_MONTH,
      timeout: cdk.Duration.seconds(5),
    });

    const api = new HttpApi(this, 'httpApi', {
      disableExecuteApiEndpoint: false,
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
    });

    api.addRoutes({
      path: '/api/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration('integration', apiLambda),
    });

    // cloudfront
    const webSiteBucket = new Bucket(this, 'WebSiteBucket', {});

    const distribution = new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(webSiteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        'api/*': {
          origin: new HttpOrigin(`${api.apiId}.execute-api.${this.region}.amazonaws.com`),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: AllowedMethods.ALLOW_ALL,
          cachePolicy: CachePolicy.CACHING_DISABLED,
          originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
      domainNames: [`${props.subdomain}.${hostedZone.zoneName}`],
      certificate: cert,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    new BucketDeployment(this, 'BucketDeployment', {
      sources: [
        Source.asset(path.join(process.cwd(), '../hello-cdk-web'), {
          bundling: {
            // image: DockerImage.fromRegistry('public.ecr.aws/docker/library/node:22.17.1'),
            image: cdk.DockerImage.fromRegistry('node:22.17.1'),
            user: 'root:root',
            command: ['sh', '-c', 'npm i && npm run build && cp -R ./dist/* /asset-output/'],
            environment: {
              ...props.frontend,
            },
          },
        }),
        // Source.data('/assets/settings.js', `window.appSettings = {\'version\': \'${version}\', \'commitId\': \'${commitId}\'};`),
        // Source.jsonData('/assets/settings.json', {version: version, commitId: commitId}),
      ],
      destinationBucket: webSiteBucket,
      distributionPaths: ['/*'],
      distribution,
    });

    new ARecord(this, 'ARecord', {
      recordName: props.subdomain,
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}
