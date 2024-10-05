export enum CredentialName {
  consumerKey = "Consumer Key",
  consumerSecret = "Consumer Secret",
  userToken = "User Token",
  userSecret = "User Secret",
}

export type CredentialKey = keyof CredentialInputs;

export interface CredentialInputs {
  consumerKey: string;
  consumerSecret: string;
  userToken: string;
  userSecret: string;
}

export enum CredentialKeeperStatus {
  waitingCredentials,
  requirePin,
  ready,
}

export type StatusChangeCallback = (newStatus: CredentialKeeperStatus) => void;
