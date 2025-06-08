import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface SecurityStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class SecurityStack extends cdk.Stack {
  public readonly albSecurityGroup: ec2.SecurityGroup;
  public readonly ecsSecurityGroup: ec2.SecurityGroup;
  public readonly rdsSecurityGroup: ec2.SecurityGroup;
  public readonly valkeySecurityGroup: ec2.SecurityGroup;
  public readonly vpcEndpointSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: SecurityStackProps) {
    super(scope, id, props);

    // ALB Security Group
    this.albSecurityGroup = new ec2.SecurityGroup(this, 'ALBSecruityGroup', {
      vpc: props.vpc,
      securityGroupName: 'ALBSecruityGroup',
      allowAllOutbound: true,
    });
    
    // Allow HTTP inbound
    this.albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
    );

    // Allow HTTPS inbound
    this.albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
    );

    // ECS Security Group
    this.ecsSecurityGroup = new ec2.SecurityGroup(this, 'EcsSecurityGroup', {
      vpc: props.vpc,
      securityGroupName: 'EcsSecurityGroup',
      allowAllOutbound: true,
    });

    // Allow inbound from ALB Security Group
    this.ecsSecurityGroup.addIngressRule(
      this.albSecurityGroup,
      ec2.Port.tcp(8080)
    );

    // RDS Security Group
    this.rdsSecurityGroup = new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
      vpc: props.vpc,
      securityGroupName: 'RdsSecurityGroup',
      allowAllOutbound: false,
    });

    // Allow inbound from ECS Security Group
    this.rdsSecurityGroup.addIngressRule(
      this.ecsSecurityGroup,
      ec2.Port.tcp(3306),
    );

    // Valkey Security Group(Allow inbound from ECS Security Group)
    this.valkeySecurityGroup = new ec2.SecurityGroup(this, 'ValkeySecurityGroup', {
      vpc: props.vpc,
      securityGroupName: 'ValkeySecurityGroup',
      allowAllOutbound: false,
    });

    this.valkeySecurityGroup.addIngressRule(
      this.ecsSecurityGroup,
      ec2.Port.tcp(6379),
    );

    // VPC Endpoint Security Group
    this.vpcEndpointSecurityGroup = new ec2.SecurityGroup(this, 'VpcEndpointSecurityGroup', {
      vpc: props.vpc,
      securityGroupName: 'VpcEndpointSecurityGroup',
      allowAllOutbound: true,
    });

    // Allow outbound to S3
    this.vpcEndpointSecurityGroup.addIngressRule(
      this.ecsSecurityGroup,
      ec2.Port.tcp(443),
    );

    cdk.Tags.of(this.albSecurityGroup).add('Name', 'ALBSecruityGroup');
    cdk.Tags.of(this.ecsSecurityGroup).add('Name', 'EcsSecurityGroup');
    cdk.Tags.of(this.rdsSecurityGroup).add('Name', 'RdsSecurityGroup');
    cdk.Tags.of(this.valkeySecurityGroup).add('Name', 'ValkeySecurityGroup');
  }

    public exportValues() {
      new cdk.CfnOutput(this, 'ALBSecurityGroupId', {
        value: this.albSecurityGroup.securityGroupId,
        exportName: 'ALBSecurityGroupId',
      });

      new cdk.CfnOutput(this, 'EcsSecurityGroupId', {
        value: this.ecsSecurityGroup.securityGroupId,
        exportName: 'EcsSecurityGroupId',
      });

      new cdk.CfnOutput(this, 'RdsSecurityGroupId', {
        value: this.rdsSecurityGroup.securityGroupId,
        exportName: 'RdsSecurityGroupId',
      });

      new cdk.CfnOutput(this, 'ValkeySecurityGroupId', {
        value: this.valkeySecurityGroup.securityGroupId,
        exportName: 'ValkeySecurityGroupId',
      });
    }
  }
