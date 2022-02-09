# gdrive-s3-sync 🔄

A full-blown Express.js/Serverless API to Sync Google Drive Files to Amazon S3

- Uses Google Auth Library to securily authenticate client before syncing!
- Tokens are stored in AWS Secrets Manager
- Fully functional parameter store for all types of client ids
- "SyncManager" endpoints, be able to call all types of endpoints for various use cases
- Full CI-CD -> Serverless Framework Managed Resources/Provisioning, GitHub Actions for CI

Features Github Action Testing

### Todo / In Progress

- Sync Manager (File Comparison between S3, Gdrive)
- GDrive File Pull
- Mocha Testing
- S3 Upload File Stream upload

