# Node.js Google Secrets Manager - Cloudflare

Integrating Google Secret Manager with Cloudflare Workers to securely manage and dynamically retrieve sensitive information at the edge with
0 dependencies.

## Prerequisites

Before you begin, make sure you have the following:

- Node.js installed (https://nodejs.org/)
- Google Cloud Platform (GCP) account with a project set up
- Google Secrets Manager API active in your project.

## Installation

Install as a dependency on your Cloudflare worker:

```shell
npm install google-cloud-secrets-manager
```

## Configuration

To retrieve secrets from Google Secrets Manager, create an instance of SecretStore like:

```javascript
new SecretsStore({ user, key, project_name })
```

1. Where the `user` is the Google Cloud Platform user or service account that has at least the following permissions to handle secrets and
   secrets versions:
    - secretmanager.secrets.create
    - secretmanager.secrets.setIamPolicy
    - secretmanager.secrets.update
    - secretmanager.versions.add
    - secretmanager.versions.access


2. The `key` is the Private Key. This key can be obtained from GCP Console. IAM - Select User - Keys. Then, generate a key if it does
   not exist
   and take the privateKey field from the json.

> ### IMPORTANT
>   The `key` in the format of -----BEGIN PRIVATE KEY----- .... -----END PRIVATE KEY----- taken from the JSON
> needs to be processed to make the '\n' real new lines because Cloudflare adds an extra '\' making it a '\\n'
> and then the decryption of the key does not work. This happens both through `wrangler secret add` and in the Cloudflare dashboard. 
>
>It does not happen in your local environment, though.
 

3. The `project_name` is the Google Cloud Platform project name.


## Usage

The project provides the following functionalities:

1. Creating a new secret in Google Cloud Secrets Manager.

```javascript
const secretsStore = new SecretsStore({ user, key, project_name });
await secretsStore.storeCredential('secretId', 'secret', { 'label1': 'labelValue1', 'label2': 'labelValue2' });
```

2. Retrieving the value of a secret.
```javascript
const secretsStore = new SecretsStore({ user, key, project_name });
await secretsStore.retrieveCredential('secretId');
```

3. Update the value of a secret:

```typescript
const secretsStore = new SecretsStore({ user, key, project_name });
await secretsStore.updateCredential('secretId', 'newSecret');
```

## Disclaimer

This project is not supported by or part of Google Cloud or Cloudflare.
