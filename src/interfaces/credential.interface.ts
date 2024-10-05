export enum CredentialName {
  consumerKey = "Consumer Key",
  consumerSecret = "Consumer Secret",
  userToken = "User Token",
  userSecret = "User Secret"
}

export interface CredentialInputs {
  [CredentialName.consumerKey]: string;
  [CredentialName.consumerSecret]: string;
  [CredentialName.userToken]: string;
  [CredentialName.userSecret]: string;
}


export enum CredentialKeeperStatus {
  waitingPin,
  waitingCredentials,
  ready
}