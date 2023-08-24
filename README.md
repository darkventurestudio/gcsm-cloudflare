# Node.js Google Secrets Manager - Cloudflare

Integrating Google Secret Manager with Cloudflare Workers to securely manage and dynamically retrieve sensitive information at the edge

## Prerequisites

Before you begin, make sure you have the following:

- Node.js installed (https://nodejs.org/)
- Google Cloud Platform (GCP) account with a project set up

## Installation

Install project dependencies:
```bash
npm install google-cloud-secrets-manager
```

## Configuration
To use the different functions in this project, you need to set up the following environment variables:

GCP_USER: Your Google Cloud Platform user (email) associated with the project.
GCP_KEY: The path to your GCP service account key file (JSON file).
GCP_PROJECT_NAME: The name of your GCP project where Secrets Manager will be used.

You can set these variables by creating a .env file in the root of the project:

```properties
GCP_USER=your-user@example.com
GCP_KEY=/path/to/your/key.json
GCP_PROJECT_NAME=your-project-name
```

Make sure to replace the values with your actual GCP information.

## Usage
The project provides the following functionalities:

Creating a new secret in Google Cloud Secrets Manager.
Retrieving the value of a secret.
To run the code demonstrating these functionalities, use the following commands:

Create a secret:
```typescript
    const secretsStore = new SecretsStore({user, key, project_name});
    await secretsStore.storeCredential('secretId', 'secret', {'label1':'labelValue1', 'label2':'labelValue2'});
```

Get the value of a secret:
```typescript
    const secretsStore = new SecretsStore({user, key, project_name});
    await secretsStore.retrieveCredential('secretId');
```


Update the value of a secret:
```typescript
    const secretsStore = new SecretsStore({user, key, project_name});
    await secretsStore.updateCredential('secretId', 'newSecret');
```

## Disclaimer
This project is not supported by or part of Google Cloud or Cloudflare
