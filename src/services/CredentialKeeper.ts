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
    this.status = CredentialKeeperStatus.waitingCredentials;
    this.testPinCount = 0;
    this.hashedPin = "";
    this.encryptCredentials = {
      consumerKey: "",
      consumerSecret: "",
      userToken: "",
      userSecret: "",
    };
  }

  private setStatus(newStatus: CredentialKeeperStatus) {
    this.status = newStatus;
    if (this.onStatusChange) {
      this.onStatusChange(newStatus);
    }
  }

  setOnStatusChangeCallback(callback: StatusChangeCallback) {
    this.onStatusChange = callback;
  }

  public async secure(credentialInputs: CredentialInputs): Promise<string[]> {
    const pin = this.randomPin();
    await Promise.all(
      Object.keys(CredentialName).map(async (key) => {
        const value = credentialInputs[key as keyof CredentialInputs];
        if (value) {
          const hashedPin = await hashData(pin.join(''));
          const encryptedValue = await this.encryptData(
            value + validTag,
            hashedPin
          );
          this.hashedPin = hashedPin;
          this.encryptCredentials[key as keyof CredentialInputs] =
            encryptedValue;
          const hashedName = await hashData(key.toString());
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

  public confirmMemorizedPin(){
    this.setStatus(CredentialKeeperStatus.requirePin);
  }

  public async reset() {
    const credentials = Object.keys(localStorage).filter((key) =>
      key.includes("credential-")
    );

    for (let key of credentials) {
      localStorage.removeItem(key);
    }

    this.encryptCredentials.consumerKey = "";
    this.encryptCredentials.consumerSecret = "";
    this.encryptCredentials.userToken = "";
    this.encryptCredentials.userSecret = "";
    this.hashedPin = "";

    this.setStatus(CredentialKeeperStatus.waitingCredentials);
  }

  private randomPin(length: number = 4): string[] {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * 10).toString()
    )
  }

  public async fetchCredentials(): Promise<void> {
    await Promise.all(
      Object.keys(CredentialName).map(async (key) => {
        const hashedName = await hashData(key);
        const encryptedValue = localStorage.getItem(`credential-${hashedName}`);

        if (encryptedValue) {
          this.encryptCredentials[key as CredentialKey] = encryptedValue;
        }
      })
    );
    if (this.validEncryptedCredentials()) {
      if (!this.hashedPin) {
        this.setStatus(CredentialKeeperStatus.requirePin);
      } else {
        this.setStatus(CredentialKeeperStatus.ready);
      }
    } else {
      this.setStatus(CredentialKeeperStatus.waitingCredentials);
    }
  }

  public async testPin(pin: string): Promise<boolean> {
    const hashedPin = await hashData(pin);
    const decryptedValue = await this.decryptData(
      this.encryptCredentials.consumerKey,
      hashedPin
    );

    if (!decryptedValue.decryptedData) {
      this.testPinCount++;
      if (this.testPinCount >= 3) {
        this.testPinCount = 0;
        await this.reset();
      }
      return false;
    } else {
      const validPin = decryptedValue.decryptedData.includes(validTag);

      if (validPin) {
        this.hashedPin = hashedPin;
        this.setStatus(CredentialKeeperStatus.ready);
      }
      return validPin;
    }
  }

  private async decryptData(
    encryptedData: string,
    hashedPin: string
  ): Promise<{ decryptedData?: string }> {
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
      return {
        decryptedData: new TextDecoder().decode(decryptedBuffer),
      };
    } catch (error) {
      return {};
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
