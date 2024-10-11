export enum CredentialName {
  ConsumerToken = "consumerToken",
  ConsumerSecret = "consumerSecret",
  UserToken = "userToken",
  UserSecret = "userSecret",
}

export type CredentialKey = keyof CredentialInputs;

export interface CredentialInputs {
  consumerToken: string;
  consumerSecret: string;
  userToken: string;
  userSecret: string;
}

export enum CredentialKeeperStatus {
  WaitingCredentials,
  RequirePin,
  Ready,
}

export type StatusChangeCallback = (newStatus: CredentialKeeperStatus) => void;
