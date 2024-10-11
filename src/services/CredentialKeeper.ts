import { log } from "node:console";
import {
  CredentialInputs,
  CredentialKeeperStatus,
  CredentialKey,
  CredentialName,
  StatusChangeCallback,
} from "../interfaces/credential.interface";
import {
  ab2b64,
  b64toab,
  hashData,
  stringToArrayBuffer,
} from "../libs/Helpers";

const validTag = "-v4l1d";

class CredentialKeeper {
  private hashedPin: string;
  private encryptCredentials: CredentialInputs;
  private testPinCount: number;
  private status: CredentialKeeperStatus;
  private onStatusChange: StatusChangeCallback | null = null;

  constructor() {
    this.status = CredentialKeeperStatus.WaitingCredentials;
    this.testPinCount = 0;
    this.hashedPin = "";
    this.encryptCredentials = {
      consumerToken: "",
      consumerSecret: "",
      userToken: "",
      userSecret: "",
    };
    this.fetchCredentials();
  }

  private setStatus(newStatus: CredentialKeeperStatus) {
    this.status = newStatus;
    if (this.onStatusChange) {
      this.onStatusChange(newStatus);
    }
  }

  private setHashedPin(pin: string) {
    this.hashedPin = pin;
  }

  setOnStatusChangeCallback(callback: StatusChangeCallback) {
    this.onStatusChange = callback;
  }

  public async decryptedCredentials(): Promise<CredentialInputs> {
    return {
      consumerToken: await this.decryptData(
        this.encryptCredentials.consumerToken,
        this.hashedPin
      ),
      consumerSecret: await this.decryptData(
        this.encryptCredentials.consumerSecret,
        this.hashedPin
      ),
      userToken: await this.decryptData(
        this.encryptCredentials.userToken,
        this.hashedPin
      ),
      userSecret: await this.decryptData(
        this.encryptCredentials.userSecret,
        this.hashedPin
      ),
    };
  }

  public async secure(credentialInputs: CredentialInputs): Promise<string[]> {
    const pin = this.randomPin();
    
    await Promise.all(
      Object.values(CredentialName).map(async (credentialName) => {
        
        const credentialValue = credentialInputs[credentialName].trim();

        if (credentialValue) {
          const hashedPin = await hashData(pin.join(""));
          const encryptedValue = await this.encryptData(
            credentialValue + validTag,
            hashedPin
          );
          this.setHashedPin(hashedPin);
          
          this.encryptCredentials[credentialName] =
            encryptedValue;
          const hashedName = await hashData(credentialName.toString());
          localStorage.setItem(`credential-${hashedName}`, encryptedValue);
        }
      })
    );
    
    return pin;
  }

  private validEncryptedCredentials() {
    return Object.values(this.encryptCredentials).every((value) => value);
  }

  public get remainingPinTest(): number {
    return 3 - this.testPinCount;
  }

  public confirmMemorizedPin() {
    this.setStatus(CredentialKeeperStatus.RequirePin);
  }

  public async reset() {
    const credentials = Object.keys(localStorage).filter((key) =>
      key.includes("credential-")
    );

    for (let key of credentials) {
      localStorage.removeItem(key);
    }

    this.encryptCredentials.consumerToken = "";
    this.encryptCredentials.consumerSecret = "";
    this.encryptCredentials.userToken = "";
    this.encryptCredentials.userSecret = "";
    this.hashedPin = "";

    this.setStatus(CredentialKeeperStatus.WaitingCredentials);
  }

  private randomPin(length: number = 4): string[] {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * 10).toString()
    );
  }

  public async fetchCredentials(): Promise<void> {
    await Promise.all(
      Object.values(CredentialName).map(async (credentialName) => {
        const hashedName = await hashData(credentialName);
        const encryptedValue = localStorage.getItem(`credential-${hashedName}`);        

        if (encryptedValue) {
          this.encryptCredentials[credentialName] = encryptedValue;
        }
      })
    );
    if (this.validEncryptedCredentials()) {
      if (!this.hashedPin) {
        this.setStatus(CredentialKeeperStatus.RequirePin);
      } else {
        this.setStatus(CredentialKeeperStatus.Ready);
      }
    } else {
      this.setStatus(CredentialKeeperStatus.WaitingCredentials);
    }
  }

  public async testPin(pin: string): Promise<boolean> {
    const hashedPin = await hashData(pin);
    const decryptedValue = await this.decryptData(
      this.encryptCredentials.consumerToken,
      hashedPin
    );

    if (!decryptedValue) {
      this.testPinCount++;
      if (this.testPinCount >= 3) {
        await this.reset();
      }
      return false;
    } else {
      this.setHashedPin(hashedPin);
      this.setStatus(CredentialKeeperStatus.Ready);
      return true;
    }
  }

  private async decryptData(
    encryptedData: string,
    hashedPin: string
  ): Promise<string> {    
    const [encryptedDataBase64, ivBase64] = encryptedData.split(".");
    const key = await this.generateKeyFromPin(hashedPin);
    const encryptedBuffer = b64toab(encryptedDataBase64);
    const initializationVector = b64toab(ivBase64);

    try {
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: initializationVector,
          tagLength: 128,
        },
        key,
        encryptedBuffer
      );
      const decodedData = new TextDecoder().decode(decryptedBuffer);
      const validData = decodedData.includes(validTag);
      if (!validData) return "";
      return decodedData.replace(validTag, "");
    } catch (error) {
      return "";
    }
  }

  private async encryptData(data: string, pin: string) {
    const key = await this.generateKeyFromPin(pin);
    const initializationVector = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for IV
    const encodedData = new TextEncoder().encode(data);

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: initializationVector,
        tagLength: 128,
      },
      key,
      encodedData
    );

    const encryptedDataBase64 = ab2b64(encryptedBuffer);
    const ivBase64 = ab2b64(initializationVector);
    return `${encryptedDataBase64}.${ivBase64}`;
  }

  private async generateKeyFromPin(pin: string) {
    const targetLength = 32;
    let expandedPin = pin;
    while (expandedPin.length < targetLength) {
      expandedPin += pin;
    }
    expandedPin = expandedPin.slice(0, targetLength);

    const pinArrayBuffer = stringToArrayBuffer(expandedPin);

    return await crypto.subtle.importKey(
      "raw",
      pinArrayBuffer,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }
}

export default CredentialKeeper;
