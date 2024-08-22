async function removeAds() {
  console.log("Blocking");
  var elementsToHide = [];
  elementsToHide = [
    "#movieplayer-box-adv",
    "#footadframe",
    "#deskadmiddle",
    ".full-bns-block",
    ".brs-block",
    ".textads",
    ".in_player_pct_outer",
    ".noopenlink",
    ".myadswarning",
    "#shorts-frame",
    ".ptgncdn_holder",
    ".adswarning",
    ".link-offer",
    ".vjs-inplayer-container",
    ".in_player_video",
    ".ads",
    ".asside",
    ".flirt-block",
    "#upperfeatureshowcaselink",
    '[class*="ad300"]',
    '[class*="adHeight"]',
    '[class*="special-offer"]',
    '[id*="adslot"]',
    ".ad-cnt",
    '[class*="rightAd"]',
    ".paisa-wrapper",
    '[id*="gpt-ad"]',
    ".tp-modal",
    ".dfp-ad",
    '[class*="ad-slot"]',
    '[class*="ad-container"]',
    '[aria-label*="advertisement"]',
    '[class*="adnative"]',
  ];
  elementsToHide.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => element.remove());
  });
}

function monitorAds() {
  const isYT = window.location.hostname.includes("youtube.com");
  if (isYT) {
    ytBlocker();
  } else {
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

removeAds();
monitorAds();
