import { getGoogleAuthToken } from './infrastructure/gcsm';
import { IAddSecretVersionRequest, ISecret } from './domain/gcsm';
import { ISecretHandle, LabelAlias } from './domain/secrets';

export class SecretsStore {

    private readonly GCP_SECRETS_MANAGER_BASE_URL_V1 = 'https://secretmanager.googleapis.com/v1';

    private readonly user: string;

    private readonly key: string;

    private readonly project_name: string;

    constructor({ user, key, project_name }: { user: string, key: string, project_name: string }) {
        this.user = user;
        this.key = key;
        this.project_name = project_name;
    }

    /**
     * Encrypts and stores the {@param credential}. Uses {@param labels} as labels of the secret.
     * @param secretId
     * @param credential
     * @param labels
     *
     * @returns string identifying the secret.
     */
    storeCredential = async (secretId: string, credential: string, labels: LabelAlias): Promise<string | null | undefined> => {
        const token = await getGoogleAuthToken(this.user, this.key);
        // 1. create secret. Creating a secret does not insert its payload.
        const createdSecret = await this.createSecret(secretId, token, labels);
        if (createdSecret.name != null) {
            // 2. add version to that secret
            await this.createSecretVersion(credential, createdSecret.internal_name, token);
            return createdSecret.internal_name;
        }
        return null;
    };

    retrieveCredential = async (credentialRef: string): Promise<string | null> => {
        const token = await getGoogleAuthToken(this.user, this.key);
        return await this.retrieveSecret(credentialRef, token);
    };

    updateCredential = async (credentialRef: string, newCredential: string) => {
        const token = await getGoogleAuthToken(this.user, this.key);
        const currentCredentialValue = await this.retrieveSecret(credentialRef, token);
        if (newCredential != currentCredentialValue) {
            return await this.createSecretVersion(newCredential, credentialRef, token);
        }
        return null;
    };

    private async retrieveSecret(credentialRef: string, token: string): Promise<string | null> {
        const accessLastSecretVersionResponse = await fetch(`${this.GCP_SECRETS_MANAGER_BASE_URL_V1}/projects/${this.project_name}/secrets/${credentialRef}/versions/latest:access`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const accessLastSecretVersionResponseBody = await accessLastSecretVersionResponse.json();
        if (typeof accessLastSecretVersionResponseBody?.payload?.data == 'string') {
            return atob(accessLastSecretVersionResponseBody.payload.data);
        } else {
            return null;
        }
    }

    private async createSecretVersion(credential: string, secretRef: string, token: string) {
        const createSecretVersionRequest: IAddSecretVersionRequest = {
            payload: {
                data: btoa(credential)
            }
        };
        const createSecretVersionResponse = await fetch(`${this.GCP_SECRETS_MANAGER_BASE_URL_V1}/projects/${this.project_name}/secrets/${secretRef}:addVersion`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(createSecretVersionRequest)
        });
        const createdSecretVersionResponseBody = await createSecretVersionResponse.json();
        console.log(`New secret version created for secret ${secretRef} with name: ${createdSecretVersionResponseBody.name}`);
        return createdSecretVersionResponseBody;
    }

    private async createSecret(secretId: string, token: string, labels: LabelAlias): Promise<ISecretHandle> {
        const secret: ISecret = {
            replication: {
                automatic: {
                    customerManagedEncryption: null
                }
            },
            labels: labels
        };

        const urlSearchParams = new URLSearchParams({
            secretId: secretId
        });

        const createSecretResponse = await fetch(`${this.GCP_SECRETS_MANAGER_BASE_URL_V1}/projects/${this.project_name}/secrets?` + urlSearchParams, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(secret)
        });
        const created_secret = await createSecretResponse.json();
        console.log(`Secret created with name: ${created_secret.name} and labels ${JSON.stringify(created_secret.labels)}`);
        return {
            internal_name: secretId,
            ...created_secret
        } as ISecretHandle;
    }
}
