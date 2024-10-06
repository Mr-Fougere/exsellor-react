import LZString from "lz-string";

class ExportArchivist {
  constructor() {}

  archive(str: string, storageKey: string): boolean {
    const compressedString = LZString.compressToBase64(str);
    if (compressedString.length <= this.remainingStorageSize) {
      localStorage.setItem(storageKey, compressedString);
      return true;
    }
    return false;
  }

  download(storageKey: string): void {
    const archiveUrl = this.archiveUrl(storageKey);
    if (!archiveUrl) return;

    chrome.downloads.download({
      url: archiveUrl,
      filename: storageKey,
      saveAs: false,
    });
  }

  archiveUrl(storageKey: string): string | undefined {
    const compressedString = this.unarchive(storageKey);
    if (!compressedString) return;

    const blob = new Blob([compressedString], {
      type: "text/csv;charset=utf-8;",
    });
    return URL.createObjectURL(blob);
  }

  unarchive(storageKey: string): string | null {
    const compressedString = localStorage.getItem(storageKey);
    if (!compressedString) return null;

    return LZString.decompressFromBase64(compressedString);
  }

  isArchived(storageKey: string): boolean {
    return localStorage.getItem(storageKey) !== null;
  }

  public get availableArchives(): string[] {
    return Object.keys(localStorage).filter((key) => key.includes(".csv"));
  }

  deleteArchive(storageKey: string): void {
    localStorage.removeItem(storageKey);
  }

  clearArchives(): void {
    localStorage.clear();
  }

  public get remainingStorageSize(): number {
    const storageSize = 1024 * 1024 * 5; // 5MB
    const usedStorage = JSON.stringify(localStorage).length;
    return storageSize - usedStorage;
  }
}

export default ExportArchivist;
