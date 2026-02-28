// Generates graph.json with AWS + Azure services and relationships

const CATEGORIES = ['Compute', 'Storage', 'Networking', 'Database', 'Security', 'AI/ML', 'Analytics', 'DevOps', 'Integration'];

const AWS_SERVICES = [
  { id: 'aws_ec2', name: 'Amazon EC2', category: 'Compute', regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2'], desc: 'Virtual servers in the cloud', cc: ['azure_vm'] },
  { id: 'aws_lambda', name: 'AWS Lambda', category: 'Compute', regions: ['us-east-1', 'us-west-2', 'eu-west-1'], desc: 'Serverless compute', cc: ['azure_functions'] },
  { id: 'aws_ecs', name: 'Amazon ECS', category: 'Compute', regions: ['us-east-1', 'eu-west-1'], desc: 'Container orchestration service', cc: ['azure_container_instances'] },
  { id: 'aws_eks', name: 'Amazon EKS', category: 'Compute', regions: ['us-east-1', 'us-west-2', 'eu-west-1'], desc: 'Managed Kubernetes', cc: ['azure_aks'] },
  { id: 'aws_fargate', name: 'AWS Fargate', category: 'Compute', regions: ['us-east-1', 'us-west-2'], desc: 'Serverless containers', cc: [] },
  { id: 'aws_batch', name: 'AWS Batch', category: 'Compute', regions: ['us-east-1'], desc: 'Batch computing', cc: ['azure_batch'] },
  { id: 'aws_lightsail', name: 'Amazon Lightsail', category: 'Compute', regions: ['us-east-1', 'ap-southeast-1'], desc: 'Simple VPS', cc: [] },
  { id: 'aws_app_runner', name: 'AWS App Runner', category: 'Compute', regions: ['us-east-1'], desc: 'Container app deployment', cc: ['azure_container_apps'] },
  { id: 'aws_outposts', name: 'AWS Outposts', category: 'Compute', regions: ['us-east-1'], desc: 'Hybrid cloud infrastructure', cc: ['azure_arc'] },
  { id: 'aws_s3', name: 'Amazon S3', category: 'Storage', regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'], desc: 'Object storage', cc: ['azure_blob'] },
  { id: 'aws_ebs', name: 'Amazon EBS', category: 'Storage', regions: ['us-east-1', 'us-west-2', 'eu-west-1'], desc: 'Block storage volumes', cc: ['azure_managed_disk'] },
  { id: 'aws_efs', name: 'Amazon EFS', category: 'Storage', regions: ['us-east-1', 'us-west-2'], desc: 'Managed file storage', cc: ['azure_files'] },
  { id: 'aws_glacier', name: 'Amazon S3 Glacier', category: 'Storage', regions: ['us-east-1', 'eu-west-1'], desc: 'Archive storage', cc: ['azure_archive_storage'] },
  { id: 'aws_fsx', name: 'Amazon FSx', category: 'Storage', regions: ['us-east-1'], desc: 'Managed file systems', cc: [] },
  { id: 'aws_storage_gateway', name: 'AWS Storage Gateway', category: 'Storage', regions: ['us-east-1'], desc: 'Hybrid storage', cc: ['azure_storsimple'] },
  { id: 'aws_backup', name: 'AWS Backup', category: 'Storage', regions: ['us-east-1', 'us-west-2'], desc: 'Centralized backup', cc: ['azure_backup'] },
  { id: 'aws_snow', name: 'AWS Snow Family', category: 'Storage', regions: ['us-east-1'], desc: 'Edge data transfer', cc: [] },
  { id: 'aws_vpc', name: 'Amazon VPC', category: 'Networking', regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'], desc: 'Virtual private cloud', cc: ['azure_vnet'] },
  { id: 'aws_cloudfront', name: 'Amazon CloudFront', category: 'Networking', regions: ['global'], desc: 'CDN', cc: ['azure_cdn'] },
  { id: 'aws_route53', name: 'Amazon Route 53', category: 'Networking', regions: ['global'], desc: 'DNS service', cc: ['azure_dns'] },
  { id: 'aws_api_gateway', name: 'Amazon API Gateway', category: 'Networking', regions: ['us-east-1', 'us-west-2'], desc: 'API management', cc: ['azure_api_management'] },
  { id: 'aws_direct_connect', name: 'AWS Direct Connect', category: 'Networking', regions: ['us-east-1', 'us-west-2'], desc: 'Dedicated network connection', cc: ['azure_expressroute'] },
  { id: 'aws_elb', name: 'Elastic Load Balancing', category: 'Networking', regions: ['us-east-1', 'us-west-2', 'eu-west-1'], desc: 'Load balancing', cc: ['azure_load_balancer'] },
  { id: 'aws_vpn', name: 'AWS VPN', category: 'Networking', regions: ['us-east-1'], desc: 'Site-to-site VPN', cc: ['azure_vpn_gateway'] },
  { id: 'aws_transit_gateway', name: 'AWS Transit Gateway', category: 'Networking', regions: ['us-east-1'], desc: 'Network hub', cc: ['azure_vwan'] },
  { id: 'aws_global_accelerator', name: 'AWS Global Accelerator', category: 'Networking', regions: ['global'], desc: 'Global networking', cc: [] },
  { id: 'aws_rds', name: 'Amazon RDS', category: 'Database', regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'], desc: 'Managed relational database', cc: ['azure_sql_database'] },
  { id: 'aws_dynamodb', name: 'Amazon DynamoDB', category: 'Database', regions: ['us-east-1', 'us-west-2', 'eu-west-1'], desc: 'NoSQL key-value database', cc: ['azure_cosmos_db'] },
  { id: 'aws_elasticache', name: 'Amazon ElastiCache', category: 'Database', regions: ['us-east-1', 'us-west-2'], desc: 'In-memory cache', cc: ['azure_cache_redis'] },
  { id: 'aws_redshift', name: 'Amazon Redshift', category: 'Database', regions: ['us-east-1', 'us-west-2'], desc: 'Data warehouse', cc: ['azure_synapse'] },
  { id: 'aws_documentdb', name: 'Amazon DocumentDB', category: 'Database', regions: ['us-east-1'], desc: 'MongoDB-compatible database', cc: ['azure_cosmos_db'] },
  { id: 'aws_neptune', name: 'Amazon Neptune', category: 'Database', regions: ['us-east-1'], desc: 'Graph database', cc: ['azure_cosmos_db'] },
  { id: 'aws_opensearch', name: 'Amazon OpenSearch', category: 'Database', regions: ['us-east-1', 'us-west-2'], desc: 'Search and analytics', cc: ['azure_cognitive_search'] },
  { id: 'aws_timestream', name: 'Amazon Timestream', category: 'Database', regions: ['us-east-1'], desc: 'Time series database', cc: [] },
  { id: 'aws_iam', name: 'AWS IAM', category: 'Security', regions: ['global'], desc: 'Identity and access management', cc: ['azure_ad'] },
  { id: 'aws_kms', name: 'AWS KMS', category: 'Security', regions: ['us-east-1', 'us-west-2'], desc: 'Key management', cc: ['azure_key_vault'] },
  { id: 'aws_secrets_manager', name: 'AWS Secrets Manager', category: 'Security', regions: ['us-east-1'], desc: 'Secrets management', cc: ['azure_key_vault'] },
  { id: 'aws_waf', name: 'AWS WAF', category: 'Security', regions: ['global'], desc: 'Web application firewall', cc: ['azure_front_door'] },
  { id: 'aws_shield', name: 'AWS Shield', category: 'Security', regions: ['global'], desc: 'DDoS protection', cc: ['azure_ddos'] },
  { id: 'aws_guardduty', name: 'Amazon GuardDuty', category: 'Security', regions: ['us-east-1'], desc: 'Threat detection', cc: ['azure_defender'] },
  { id: 'aws_cognito', name: 'Amazon Cognito', category: 'Security', regions: ['us-east-1'], desc: 'User authentication', cc: ['azure_ad_b2c'] },
  { id: 'aws_inspector', name: 'Amazon Inspector', category: 'Security', regions: ['us-east-1'], desc: 'Security assessment', cc: [] },
  { id: 'aws_sagemaker', name: 'Amazon SageMaker', category: 'AI/ML', regions: ['us-east-1', 'us-west-2'], desc: 'ML platform', cc: ['azure_ml'] },
  { id: 'aws_comprehend', name: 'Amazon Comprehend', category: 'AI/ML', regions: ['us-east-1'], desc: 'NLP service', cc: ['azure_language'] },
  { id: 'aws_rekognition', name: 'Amazon Rekognition', category: 'AI/ML', regions: ['us-east-1'], desc: 'Image and video analysis', cc: ['azure_computer_vision'] },
  { id: 'aws_transcribe', name: 'Amazon Transcribe', category: 'AI/ML', regions: ['us-east-1'], desc: 'Speech-to-text', cc: ['azure_speech'] },
  { id: 'aws_polly', name: 'Amazon Polly', category: 'AI/ML', regions: ['us-east-1'], desc: 'Text-to-speech', cc: ['azure_speech'] },
  { id: 'aws_translate', name: 'Amazon Translate', category: 'AI/ML', regions: ['us-east-1'], desc: 'Language translation', cc: ['azure_translator'] },
  { id: 'aws_bedrock', name: 'Amazon Bedrock', category: 'AI/ML', regions: ['us-east-1'], desc: 'Generative AI', cc: ['azure_openai'] },
  { id: 'aws_athena', name: 'Amazon Athena', category: 'Analytics', regions: ['us-east-1'], desc: 'Query S3 data', cc: [] },
  { id: 'aws_emr', name: 'Amazon EMR', category: 'Analytics', regions: ['us-east-1', 'us-west-2'], desc: 'Big data processing', cc: ['azure_hdinsight'] },
  { id: 'aws_kinesis', name: 'Amazon Kinesis', category: 'Analytics', regions: ['us-east-1'], desc: 'Real-time streaming', cc: ['azure_event_hubs'] },
  { id: 'aws_quicksight', name: 'Amazon QuickSight', category: 'Analytics', regions: ['us-east-1'], desc: 'Business intelligence', cc: ['azure_power_bi'] },
  { id: 'aws_data_pipeline', name: 'AWS Data Pipeline', category: 'Analytics', regions: ['us-east-1'], desc: 'Data orchestration', cc: ['azure_data_factory'] },
  { id: 'aws_glue', name: 'AWS Glue', category: 'Analytics', regions: ['us-east-1'], desc: 'ETL service', cc: ['azure_data_factory'] },
  { id: 'aws_lake_formation', name: 'AWS Lake Formation', category: 'Analytics', regions: ['us-east-1'], desc: 'Data lake management', cc: [] },
  { id: 'aws_cloudwatch', name: 'Amazon CloudWatch', category: 'DevOps', regions: ['us-east-1', 'us-west-2'], desc: 'Monitoring and logs', cc: ['azure_monitor'] },
  { id: 'aws_xray', name: 'AWS X-Ray', category: 'DevOps', regions: ['us-east-1'], desc: 'Distributed tracing', cc: ['azure_application_insights'] },
  { id: 'aws_codebuild', name: 'AWS CodeBuild', category: 'DevOps', regions: ['us-east-1'], desc: 'Build service', cc: ['azure_pipelines'] },
  { id: 'aws_codedeploy', name: 'AWS CodeDeploy', category: 'DevOps', regions: ['us-east-1'], desc: 'Deployment automation', cc: [] },
  { id: 'aws_codepipeline', name: 'AWS CodePipeline', category: 'DevOps', regions: ['us-east-1'], desc: 'CI/CD pipelines', cc: ['azure_devops'] },
  { id: 'aws_cloudformation', name: 'AWS CloudFormation', category: 'DevOps', regions: ['us-east-1'], desc: 'Infrastructure as code', cc: ['azure_resource_manager'] },
  { id: 'aws_systems_manager', name: 'AWS Systems Manager', category: 'DevOps', regions: ['us-east-1'], desc: 'Operations management', cc: [] },
  { id: 'aws_config', name: 'AWS Config', category: 'DevOps', regions: ['us-east-1'], desc: 'Configuration compliance', cc: ['azure_policy'] },
  { id: 'aws_sns', name: 'Amazon SNS', category: 'Integration', regions: ['us-east-1', 'us-west-2'], desc: 'Pub/sub messaging', cc: ['azure_service_bus'] },
  { id: 'aws_sqs', name: 'Amazon SQS', category: 'Integration', regions: ['us-east-1', 'us-west-2'], desc: 'Message queue', cc: ['azure_service_bus'] },
  { id: 'aws_eventbridge', name: 'Amazon EventBridge', category: 'Integration', regions: ['us-east-1'], desc: 'Event bus', cc: ['azure_event_grid'] },
  { id: 'aws_step_functions', name: 'AWS Step Functions', category: 'Integration', regions: ['us-east-1'], desc: 'Workflow orchestration', cc: ['azure_logic_apps'] },
  { id: 'aws_app_sync', name: 'AWS AppSync', category: 'Integration', regions: ['us-east-1'], desc: 'GraphQL API', cc: [] },
  { id: 'aws_mq', name: 'Amazon MQ', category: 'Integration', regions: ['us-east-1'], desc: 'Managed message broker', cc: ['azure_service_bus'] },
  { id: 'aws_data_sync', name: 'AWS DataSync', category: 'Integration', regions: ['us-east-1'], desc: 'Data transfer', cc: [] },
  { id: 'aws_transfer', name: 'AWS Transfer Family', category: 'Integration', regions: ['us-east-1'], desc: 'File transfer', cc: [] },
  { id: 'aws_ec2_auto_scaling', name: 'EC2 Auto Scaling', category: 'Compute', regions: ['us-east-1'], desc: 'Auto-scaling groups', cc: ['azure_vm_scale_sets'] },
  { id: 'aws_workspaces', name: 'Amazon WorkSpaces', category: 'Compute', regions: ['us-east-1'], desc: 'Virtual desktops', cc: ['azure_virtual_desktop'] },
  { id: 'aws_elastic_beanstalk', name: 'AWS Elastic Beanstalk', category: 'Compute', regions: ['us-east-1'], desc: 'Platform as a service', cc: ['azure_app_service'] },
  { id: 'aws_cloud9', name: 'AWS Cloud9', category: 'DevOps', regions: ['us-east-1'], desc: 'Cloud IDE', cc: [] },
  { id: 'aws_codecommit', name: 'AWS CodeCommit', category: 'DevOps', regions: ['us-east-1'], desc: 'Git repositories', cc: ['azure_repos'] },
  { id: 'aws_codeartifact', name: 'AWS CodeArtifact', category: 'DevOps', regions: ['us-east-1'], desc: 'Package management', cc: [] },
  { id: 'aws_artifact', name: 'AWS Artifact', category: 'Security', regions: ['us-east-1'], desc: 'Compliance reports', cc: [] },
  { id: 'aws_forecast', name: 'Amazon Forecast', category: 'AI/ML', regions: ['us-east-1'], desc: 'Time series forecasting', cc: [] },
  { id: 'aws_personalize', name: 'Amazon Personalize', category: 'AI/ML', regions: ['us-east-1'], desc: 'Recommendation engine', cc: [] },
  { id: 'aws_textract', name: 'Amazon Textract', category: 'AI/ML', regions: ['us-east-1'], desc: 'Document extraction', cc: ['azure_form_recognizer'] },
  { id: 'aws_connect', name: 'Amazon Connect', category: 'Integration', regions: ['us-east-1'], desc: 'Contact center', cc: [] },
  { id: 'aws_pinpoint', name: 'Amazon Pinpoint', category: 'Integration', regions: ['us-east-1'], desc: 'Customer engagement', cc: [] },
  { id: 'aws_chime', name: 'Amazon Chime', category: 'Integration', regions: ['us-east-1'], desc: 'Communications', cc: [] },
];

const AZURE_SERVICES = [
  { id: 'azure_vm', name: 'Azure Virtual Machines', category: 'Compute', regions: ['eastus', 'westus2', 'westeurope', 'southeastasia'], desc: 'Virtual servers', cc: ['aws_ec2'] },
  { id: 'azure_functions', name: 'Azure Functions', category: 'Compute', regions: ['eastus', 'westus2', 'westeurope'], desc: 'Serverless compute', cc: ['aws_lambda'] },
  { id: 'azure_container_instances', name: 'Azure Container Instances', category: 'Compute', regions: ['eastus', 'westeurope'], desc: 'Run containers', cc: ['aws_ecs'] },
  { id: 'azure_aks', name: 'Azure Kubernetes Service', category: 'Compute', regions: ['eastus', 'westus2', 'westeurope'], desc: 'Managed Kubernetes', cc: ['aws_eks'] },
  { id: 'azure_batch', name: 'Azure Batch', category: 'Compute', regions: ['eastus'], desc: 'Batch computing', cc: ['aws_batch'] },
  { id: 'azure_container_apps', name: 'Azure Container Apps', category: 'Compute', regions: ['eastus'], desc: 'Container workloads', cc: ['aws_app_runner'] },
  { id: 'azure_arc', name: 'Azure Arc', category: 'Compute', regions: ['eastus'], desc: 'Hybrid cloud', cc: ['aws_outposts'] },
  { id: 'azure_app_service', name: 'Azure App Service', category: 'Compute', regions: ['eastus', 'westeurope'], desc: 'Web and API hosting', cc: ['aws_elastic_beanstalk'] },
  { id: 'azure_vm_scale_sets', name: 'Virtual Machine Scale Sets', category: 'Compute', regions: ['eastus'], desc: 'Auto-scaling VMs', cc: ['aws_ec2_auto_scaling'] },
  { id: 'azure_virtual_desktop', name: 'Azure Virtual Desktop', category: 'Compute', regions: ['eastus'], desc: 'Virtual desktops', cc: ['aws_workspaces'] },
  { id: 'azure_blob', name: 'Azure Blob Storage', category: 'Storage', regions: ['eastus', 'westus2', 'westeurope', 'southeastasia'], desc: 'Object storage', cc: ['aws_s3'] },
  { id: 'azure_managed_disk', name: 'Azure Managed Disks', category: 'Storage', regions: ['eastus', 'westus2', 'westeurope'], desc: 'Block storage', cc: ['aws_ebs'] },
  { id: 'azure_files', name: 'Azure Files', category: 'Storage', regions: ['eastus', 'westus2'], desc: 'File shares', cc: ['aws_efs'] },
  { id: 'azure_archive_storage', name: 'Azure Archive Storage', category: 'Storage', regions: ['eastus'], desc: 'Archive tier', cc: ['aws_glacier'] },
  { id: 'azure_storsimple', name: 'Azure StorSimple', category: 'Storage', regions: ['eastus'], desc: 'Hybrid storage', cc: ['aws_storage_gateway'] },
  { id: 'azure_backup', name: 'Azure Backup', category: 'Storage', regions: ['eastus', 'westus2'], desc: 'Backup service', cc: ['aws_backup'] },
  { id: 'azure_data_lake', name: 'Azure Data Lake Storage', category: 'Storage', regions: ['eastus'], desc: 'Big data storage', cc: [] },
  { id: 'azure_queue_storage', name: 'Azure Queue Storage', category: 'Storage', regions: ['eastus'], desc: 'Message queue storage', cc: [] },
  { id: 'azure_vnet', name: 'Azure Virtual Network', category: 'Networking', regions: ['eastus', 'westus2', 'westeurope'], desc: 'Virtual network', cc: ['aws_vpc'] },
  { id: 'azure_cdn', name: 'Azure CDN', category: 'Networking', regions: ['global'], desc: 'Content delivery', cc: ['aws_cloudfront'] },
  { id: 'azure_dns', name: 'Azure DNS', category: 'Networking', regions: ['global'], desc: 'DNS hosting', cc: ['aws_route53'] },
  { id: 'azure_api_management', name: 'Azure API Management', category: 'Networking', regions: ['eastus', 'westeurope'], desc: 'API gateway', cc: ['aws_api_gateway'] },
  { id: 'azure_expressroute', name: 'Azure ExpressRoute', category: 'Networking', regions: ['eastus', 'westus2'], desc: 'Private connection', cc: ['aws_direct_connect'] },
  { id: 'azure_load_balancer', name: 'Azure Load Balancer', category: 'Networking', regions: ['eastus', 'westus2'], desc: 'Load balancing', cc: ['aws_elb'] },
  { id: 'azure_vpn_gateway', name: 'Azure VPN Gateway', category: 'Networking', regions: ['eastus'], desc: 'VPN connectivity', cc: ['aws_vpn'] },
  { id: 'azure_vwan', name: 'Azure Virtual WAN', category: 'Networking', regions: ['eastus'], desc: 'Global networking', cc: ['aws_transit_gateway'] },
  { id: 'azure_front_door', name: 'Azure Front Door', category: 'Networking', regions: ['global'], desc: 'Application delivery', cc: ['aws_waf'] },
  { id: 'azure_traffic_manager', name: 'Azure Traffic Manager', category: 'Networking', regions: ['global'], desc: 'Traffic routing', cc: [] },
  { id: 'azure_sql_database', name: 'Azure SQL Database', category: 'Database', regions: ['eastus', 'westus2', 'westeurope'], desc: 'Managed SQL', cc: ['aws_rds'] },
  { id: 'azure_cosmos_db', name: 'Azure Cosmos DB', category: 'Database', regions: ['eastus', 'westus2', 'westeurope'], desc: 'Multi-model database', cc: ['aws_dynamodb', 'aws_documentdb', 'aws_neptune'] },
  { id: 'azure_cache_redis', name: 'Azure Cache for Redis', category: 'Database', regions: ['eastus', 'westus2'], desc: 'Redis cache', cc: ['aws_elasticache'] },
  { id: 'azure_synapse', name: 'Azure Synapse Analytics', category: 'Database', regions: ['eastus', 'westus2'], desc: 'Analytics workspace', cc: ['aws_redshift'] },
  { id: 'azure_cognitive_search', name: 'Azure AI Search', category: 'Database', regions: ['eastus'], desc: 'Search service', cc: ['aws_opensearch'] },
  { id: 'azure_postgresql', name: 'Azure Database for PostgreSQL', category: 'Database', regions: ['eastus'], desc: 'Managed PostgreSQL', cc: [] },
  { id: 'azure_mysql', name: 'Azure Database for MySQL', category: 'Database', regions: ['eastus'], desc: 'Managed MySQL', cc: [] },
  { id: 'azure_ad', name: 'Microsoft Entra ID', category: 'Security', regions: ['global'], desc: 'Identity management', cc: ['aws_iam'] },
  { id: 'azure_key_vault', name: 'Azure Key Vault', category: 'Security', regions: ['eastus', 'westus2'], desc: 'Secrets management', cc: ['aws_kms', 'aws_secrets_manager'] },
  { id: 'azure_ddos', name: 'Azure DDoS Protection', category: 'Security', regions: ['eastus'], desc: 'DDoS mitigation', cc: ['aws_shield'] },
  { id: 'azure_defender', name: 'Microsoft Defender for Cloud', category: 'Security', regions: ['eastus'], desc: 'Cloud security', cc: ['aws_guardduty'] },
  { id: 'azure_ad_b2c', name: 'Azure AD B2C', category: 'Security', regions: ['eastus'], desc: 'Customer identity', cc: ['aws_cognito'] },
  { id: 'azure_policy', name: 'Azure Policy', category: 'Security', regions: ['eastus'], desc: 'Governance', cc: ['aws_config'] },
  { id: 'azure_sentinel', name: 'Microsoft Sentinel', category: 'Security', regions: ['eastus'], desc: 'SIEM', cc: [] },
  { id: 'azure_ml', name: 'Azure Machine Learning', category: 'AI/ML', regions: ['eastus', 'westus2'], desc: 'ML platform', cc: ['aws_sagemaker'] },
  { id: 'azure_language', name: 'Azure AI Language', category: 'AI/ML', regions: ['eastus'], desc: 'NLP service', cc: ['aws_comprehend'] },
  { id: 'azure_computer_vision', name: 'Azure AI Vision', category: 'AI/ML', regions: ['eastus'], desc: 'Image analysis', cc: ['aws_rekognition'] },
  { id: 'azure_speech', name: 'Azure AI Speech', category: 'AI/ML', regions: ['eastus'], desc: 'Speech services', cc: ['aws_transcribe', 'aws_polly'] },
  { id: 'azure_translator', name: 'Azure AI Translator', category: 'AI/ML', regions: ['eastus'], desc: 'Translation', cc: ['aws_translate'] },
  { id: 'azure_openai', name: 'Azure OpenAI Service', category: 'AI/ML', regions: ['eastus'], desc: 'Generative AI', cc: ['aws_bedrock'] },
  { id: 'azure_form_recognizer', name: 'Azure Document Intelligence', category: 'AI/ML', regions: ['eastus'], desc: 'Document understanding', cc: ['aws_textract'] },
  { id: 'azure_cognitive_services', name: 'Azure AI Services', category: 'AI/ML', regions: ['eastus'], desc: 'AI APIs', cc: [] },
  { id: 'azure_hdinsight', name: 'Azure HDInsight', category: 'Analytics', regions: ['eastus', 'westus2'], desc: 'Big data clusters', cc: ['aws_emr'] },
  { id: 'azure_event_hubs', name: 'Azure Event Hubs', category: 'Analytics', regions: ['eastus'], desc: 'Streaming platform', cc: ['aws_kinesis'] },
  { id: 'azure_power_bi', name: 'Microsoft Power BI', category: 'Analytics', regions: ['eastus'], desc: 'Business intelligence', cc: ['aws_quicksight'] },
  { id: 'azure_data_factory', name: 'Azure Data Factory', category: 'Analytics', regions: ['eastus'], desc: 'Data integration', cc: ['aws_glue', 'aws_data_pipeline'] },
  { id: 'azure_databricks', name: 'Azure Databricks', category: 'Analytics', regions: ['eastus'], desc: 'Analytics platform', cc: [] },
  { id: 'azure_stream_analytics', name: 'Azure Stream Analytics', category: 'Analytics', regions: ['eastus'], desc: 'Stream processing', cc: [] },
  { id: 'azure_analysis_services', name: 'Azure Analysis Services', category: 'Analytics', regions: ['eastus'], desc: 'Analytics engine', cc: [] },
  { id: 'azure_monitor', name: 'Azure Monitor', category: 'DevOps', regions: ['eastus', 'westus2'], desc: 'Monitoring', cc: ['aws_cloudwatch'] },
  { id: 'azure_application_insights', name: 'Application Insights', category: 'DevOps', regions: ['eastus'], desc: 'APM', cc: ['aws_xray'] },
  { id: 'azure_pipelines', name: 'Azure DevOps Pipelines', category: 'DevOps', regions: ['eastus'], desc: 'CI/CD', cc: ['aws_codebuild', 'aws_codepipeline'] },
  { id: 'azure_devops', name: 'Azure DevOps', category: 'DevOps', regions: ['eastus'], desc: 'DevOps platform', cc: ['aws_codepipeline'] },
  { id: 'azure_resource_manager', name: 'Azure Resource Manager', category: 'DevOps', regions: ['eastus'], desc: 'Infrastructure management', cc: ['aws_cloudformation'] },
  { id: 'azure_repos', name: 'Azure Repos', category: 'DevOps', regions: ['eastus'], desc: 'Git repos', cc: ['aws_codecommit'] },
  { id: 'azure_service_bus', name: 'Azure Service Bus', category: 'Integration', regions: ['eastus', 'westus2'], desc: 'Messaging', cc: ['aws_sns', 'aws_sqs', 'aws_mq'] },
  { id: 'azure_event_grid', name: 'Azure Event Grid', category: 'Integration', regions: ['eastus'], desc: 'Event routing', cc: ['aws_eventbridge'] },
  { id: 'azure_logic_apps', name: 'Azure Logic Apps', category: 'Integration', regions: ['eastus'], desc: 'Workflow automation', cc: ['aws_step_functions'] },
  { id: 'azure_service_fabric', name: 'Azure Service Fabric', category: 'Integration', regions: ['eastus'], desc: 'Microservices platform', cc: [] },
  { id: 'azure_notification_hubs', name: 'Azure Notification Hubs', category: 'Integration', regions: ['eastus'], desc: 'Push notifications', cc: [] },
  { id: 'azure_storage_queue', name: 'Azure Storage Queues', category: 'Integration', regions: ['eastus'], desc: 'Queue storage', cc: [] },
];

function toNode(svc, provider) {
  return {
    id: svc.id,
    name: svc.name,
    provider,
    category: svc.category,
    preview: Math.random() > 0.7,
    regions: svc.regions,
    description: svc.desc,
    crossCloudCompatible: svc.cc || [],
  };
}

const nodes = [
  ...AWS_SERVICES.map((s) => toNode(s, 'AWS')),
  ...AZURE_SERVICES.map((s) => toNode(s, 'Azure')),
];

const allIds = nodes.map((n) => n.id);

function addIntraLinks(links, providerNodes, count) {
  const ids = providerNodes.map((n) => n.id);
  let added = 0;
  for (let i = 0; i < ids.length && added < count; i++) {
    for (let j = i + 1; j < ids.length && added < count; j++) {
      if (Math.random() > 0.6) {
        links.push({
          source: ids[i],
          target: ids[j],
          type: 'intra-cloud',
          weight: 1,
        });
        added++;
      }
    }
  }
  // Add more predictable links by category
  const byCat = {};
  providerNodes.forEach((n) => {
    if (!byCat[n.category]) byCat[n.category] = [];
    byCat[n.category].push(n.id);
  });
  Object.values(byCat).forEach((catIds) => {
    for (let i = 0; i < catIds.length - 1 && added < count; i++) {
      links.push({
        source: catIds[i],
        target: catIds[i + 1],
        type: 'intra-cloud',
        weight: 1,
      });
      added++;
    }
  });
}

function addCrossCloudLinks(links) {
  const crossCloud = [];
  nodes.forEach((n) => {
    (n.crossCloudCompatible || []).forEach((target) => {
      if (allIds.includes(target)) {
        crossCloud.push({ source: n.id, target, weight: 2 });
      }
    });
  });
  crossCloud.forEach((l) => links.push({ ...l, type: 'cross-cloud' }));
}

const links = [];
addIntraLinks(links, nodes.filter((n) => n.provider === 'AWS'), 180);
addIntraLinks(links, nodes.filter((n) => n.provider === 'Azure'), 180);
addCrossCloudLinks(links);

const graph = { nodes, links };
console.log(JSON.stringify(graph, null, 0));
