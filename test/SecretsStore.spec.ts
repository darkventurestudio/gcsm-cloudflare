import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getGoogleAuthToken from '../src/infrastructure/gcsm';
import { SecretsStore } from '../src';

global.fetch = vi.fn();

vi.spyOn(getGoogleAuthToken, "getGoogleAuthToken").mockReturnValue(Promise.resolve("token"));

const createFetchResponse = (data: unknown) => ({ json: () => Promise.resolve(data) });

describe("SecretsStore", () => {
    let testObj: SecretsStore;

    beforeEach(() => {
        testObj = new SecretsStore({
            user: "gcpUser",
            key: "gcpKey",
            project_name: "gcpProjectName"
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("storeCredential should create a secret and add a version", async () => {
        fetch
                .mockReturnValueOnce(createFetchResponse({ name: "projects/gcpProjectName/secrets/secretRef" }))
                .mockReturnValueOnce(createFetchResponse({ name: "projects/gcpProjectName/secrets/secretRef/versions/1" }));

        const result = await testObj.storeCredential("secretId", "credential", {
            "label1": "label1Value",
            "label2": "label2Value"
        });

        expect(result).eq("secretId");
        expect(fetch).toHaveBeenNthCalledWith(1,
                "https://secretmanager.googleapis.com/v1/projects/gcpProjectName/secrets?secretId=secretId",
                {
                    headers: {
                        Authorization: "Bearer token"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        replication: {
                            automatic: {
                                customerManagedEncryption: null
                            }
                        },
                        labels: {
                            "label1": "label1Value",
                            "label2": "label2Value"
                        }
                    })
                }
        );
        expect(fetch).toHaveBeenNthCalledWith(2,
                "https://secretmanager.googleapis.com/v1/projects/gcpProjectName/secrets/secretId:addVersion",
                {
                    headers: {
                        Authorization: "Bearer token"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        payload: {
                            data: btoa("credential")
                        }
                    })
                }
        );
    });

    it("retrieveCredential should obtain the credential by the given secret reference", async () => {
        fetch.mockReturnValueOnce(createFetchResponse({ payload: { data: btoa("secret") } }));

        const result = await testObj.retrieveCredential("secretRef");

        expect(fetch).toBeCalledWith("https://secretmanager.googleapis.com/v1/projects/gcpProjectName/secrets/secretRef/versions/latest:access", {
            headers: {
                Authorization: "Bearer token"
            }
        });
        expect(result).toEqual("secret");
    });

    it("updateCredential should create a new version when the provided secret is different than the current value", async () => {
        fetch
                .mockReturnValueOnce(createFetchResponse({ payload: { data: btoa("secret") } }))
                .mockReturnValueOnce(createFetchResponse({ name: "projects/gcpProjectName/secrets/secretRef/versions/2" }));

        const result = await testObj.updateCredential("secretRef", "newSecret");

        expect(fetch).toHaveBeenNthCalledWith(1, "https://secretmanager.googleapis.com/v1/projects/gcpProjectName/secrets/secretRef/versions/latest:access", {
            headers: {
                Authorization: "Bearer token"
            }
        });
        expect(fetch).toHaveBeenNthCalledWith(2,
                "https://secretmanager.googleapis.com/v1/projects/gcpProjectName/secrets/secretRef:addVersion",
                {
                    headers: {
                        Authorization: "Bearer token"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        payload: {
                            data: btoa("newSecret")
                        }
                    })
                }
        );
        expect(result.name).toEqual("projects/gcpProjectName/secrets/secretRef/versions/2");
    });

    it("updateCredential should NOT create a new version when the provided secret is the same as the current value", async () => {
        fetch
                .mockReturnValueOnce(createFetchResponse({ payload: { data: btoa("secret") } }));
        const result = await testObj.updateCredential("secretRef", "secret");

        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith("https://secretmanager.googleapis.com/v1/projects/gcpProjectName/secrets/secretRef/versions/latest:access", {
            headers: {
                Authorization: "Bearer token"
            }
        });
        expect(result).toBeNull();
    });
});
