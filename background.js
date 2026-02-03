function updateIcon(tabId, url) {
  if (!url) return;

  const parsedUrl = new URL(url);
  const watchPath = parsedUrl.pathname === "/watch";
  const isYouTube = parsedUrl.hostname === "www.youtube.com" && watchPath;
  const isYouTubeMusic =
    parsedUrl.hostname === "music.youtube.com" && watchPath;

  chrome.action.setIcon({
    tabId,
    path: !isYouTube && !isYouTubeMusic ? "icon_disabled.png" : "icon.png",
  });
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => updateIcon(tabId, tab.url));
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) updateIcon(tabId, changeInfo.url);
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) {
    return;
  }

  const url = new URL(tab.url);

  const watchPath = url.pathname === "/watch";

  const isYouTube = url.hostname === "www.youtube.com" && watchPath;

  const isYouTubeMusic = url.hostname === "music.youtube.com" && watchPath;

  if (!isYouTube && !isYouTubeMusic) {
    return;
  }

  const videoId = url.searchParams.get("v");

  if (!videoId) {
    return;
  }

  chrome.tabs.update(tab.id, {
    url: `https://${isYouTube ? "music" : "www"}.youtube.com/watch?v=${videoId}`,
  });
});
