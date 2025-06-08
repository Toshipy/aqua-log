#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { SecurityStack } from '../lib/security-stack';

const app = new cdk.App();

const networkStack = new NetworkStack(app, 'NetworkStack', {
});

const securityStack = new SecurityStack(app, 'SecurityStack', {
  vpc: networkStack.vpc,
});

securityStack.addDependency(networkStack);
