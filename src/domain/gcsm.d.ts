export interface ISecret {

  /** Secret name */
  name?: (string | null);

  /** Secret replication */
  replication?: (IReplication | null);

  /** Secret createTime */
  createTime?: (ITimestamp | null);

  /** Secret labels */
  labels?: ({ [k: string]: string } | null);

  /** Secret topics */
  topics?: (ITopic[] | null);

  /** Secret expireTime */
  expireTime?: (ITimestamp | null);

  /** Secret ttl */
  ttl?: (IDuration | null);

  /** Secret etag */
  etag?: (string | null);

  /** Secret rotation */
  rotation?: (IRotation | null);

  /** Secret versionAliases */
  versionAliases?: ({ [k: string]: (number | string) } | null);

  /** Secret annotations */
  annotations?: ({ [k: string]: string } | null);
}

export interface ITimestamp {

  /** Timestamp seconds */
  seconds?: (number | string | null);

  /** Timestamp nanos */
  nanos?: (number | null);
}

export interface IReplication {

  /** Replication automatic */
  automatic?: (IAutomatic | null);

  /** Replication userManaged */
  userManaged?: (IUserManaged | null);
}

export interface IAutomatic {
  /** Automatic customerManagedEncryption */
  customerManagedEncryption?: (ICustomerManagedEncryption | null);
}

export interface ICustomerManagedEncryption {
  /** CustomerManagedEncryption kmsKeyName */
  kmsKeyName?: (string | null);
}

export interface IUserManaged {
  /** UserManaged replicas */
  replicas?: (IReplica[] | null);
}

export interface IReplica {

  /** Replica location */
  location?: (string | null);

  /** Replica customerManagedEncryption */
  customerManagedEncryption?: (ICustomerManagedEncryption | null);
}

export interface ITopic {
  /** Topic name */
  name?: (string | null);
}

export interface IRotation {
  /** Rotation nextRotationTime */
  nextRotationTime?: (ITimestamp | null);

  /** Rotation rotationPeriod */
  rotationPeriod?: (IDuration | null);
}

export interface IDuration {

  /** Duration seconds */
  seconds?: (number | string | null);

  /** Duration nanos */
  nanos?: (number | null);
}

export interface ISecretVersion {

  /** SecretVersion name */
  name?: (string | null);

  /** SecretVersion createTime */
  createTime?: (ITimestamp | null);

  /** SecretVersion destroyTime */
  destroyTime?: (ITimestamp | null);

  /** SecretVersion state */
  state?: (State | keyof typeof State | null);

  /** SecretVersion replicationStatus */
  replicationStatus?: (IReplicationStatus | null);

  /** SecretVersion etag */
  etag?: (string | null);

  /** SecretVersion clientSpecifiedPayloadChecksum */
  clientSpecifiedPayloadChecksum?: (boolean | null);
}

export enum State {
  STATE_UNSPECIFIED = 0,
  ENABLED = 1,
  DISABLED = 2,
  DESTROYED = 3
}

export interface IReplicationStatus {

  /** ReplicationStatus automatic */
  automatic?: (IAutomaticStatus | null);

  /** ReplicationStatus userManaged */
  userManaged?: (IUserManagedStatus | null);
}

export interface IAutomaticStatus {

  /** AutomaticStatus customerManagedEncryption */
  customerManagedEncryption?: (ICustomerManagedEncryptionStatus | null);
}

export interface ICustomerManagedEncryptionStatus {
  /** CustomerManagedEncryptionStatus kmsKeyVersionName */
  kmsKeyVersionName?: (string | null);
}

export interface IUserManagedStatus {

  /** UserManagedStatus replicas */
  replicas?: (IReplicaStatus[] | null);
}

export interface IReplicaStatus {

  /** ReplicaStatus location */
  location?: (string | null);

  /** ReplicaStatus customerManagedEncryption */
  customerManagedEncryption?: (ICustomerManagedEncryptionStatus | null);
}

export interface ISecretPayload {

  /** SecretPayload data */
  data?: (Uint8Array | string | null);

  /** SecretPayload dataCrc32c */
  dataCrc32c?: (number | string | null);
}

export interface IAddSecretVersionRequest {

  /** AddSecretVersionRequest parent */
  parent?: (string | null);

  /** AddSecretVersionRequest payload */
  payload?: (ISecretPayload | null);
}

/** Properties of an AccessSecretVersionResponse. */
export interface IAccessSecretVersionResponse {

  /** AccessSecretVersionResponse name */
  name?: (string | null);

  /** AccessSecretVersionResponse payload */
  payload?: (ISecretPayload | null);
}
