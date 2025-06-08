## Setup
```
npm install -g npm@11.4.1

mkdir cdk & cd cdk

cdk init app --language typescript
```

## スタック分割戦略
Phase 1: ベースインフラ（依存関係なし）
- NetworkStack - VPC、サブネット、ルーティング
- SecurityStack - Security Groups、NACLs
- CognitoStack - 認証基盤
- ECRStack - コンテナレジストリ

Phase 2: データ層（ネットワーク依存）
- ValkeyStack - セッション管理
- RDSStack - データベース

Phase 3: コンピュート層（すべてに依存）
- ALBStack - Load Balancer
- ECSStack - アプリケーション


```
aws sts get-caller-identity

cdk bootstrap aws://ACCOUNT-ID/ap-northeast-1

```

## Network
```
10.0.0.0/16 VPC
├── 10.0.1.0/24 Public Subnet AZ-A
├── 10.0.2.0/24 Public Subnet AZ-C  
├── 10.0.11.0/24 Private Subnet AZ-A (ECS, RDS, Valkey)
└── 10.0.12.0/24 Private Subnet AZ-C (ECS, RDS, Valkey)
```
