function changeFavicon(iconUrl: string): void{
  const link: HTMLLinkElement =
    document.querySelector("link[rel='icon']") ||
    document.createElement("link");
  link.rel = "icon";
  link.href = iconUrl;

  document.head.appendChild(link);
}


export default changeFavicon