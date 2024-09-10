async function removeAds() {
  var elementsToHide = [];
  elementsToHide = [
    '[class*="adswarning"]',
    '[class*="ad300"]',
    '[class*="adHeight"]',
    '[class*="special-offer"]',
    '[id*="adslot"]',
    '[class*="rightAd"]',
    '[id*="gpt-ad"]',
    '[class*="ad-slot"]',
    '[class*="ad-container"]',
    '[aria-label*="advertisement"]',
    '[class*="adnative"]',
    '[class*=".wps-player__happy-inside"]',
    '[id*="admobile"]',
    '[id*="deskad"]',
    ".vjs-inplayer-container",
    "#movieplayer-box-adv",
    "#EPimLayerOuter",
    '[class*="ads-banner"]',
    '[class*="ad-box"]',
    '[id*="adframe"]',
    '[class*="promo-ad"]',
    '[id*="adleaderboard"]',
    '[class*="banner-ad"]',
    '[id*="sponsored"]',
    '[class*="ad-display"]',
    '[id*="advert"]',
    '[class*="popup-ad"]',
    '[id*="adside"]',
    '[class*="adspace"]',
    '[class*="adblock"]',
    '[id*="adtop"]',
    ".ad-wrapper",
    ".advertisement-container",
    ".ad-section",
    '[class*="ad-wrap"]',
    '[class*="ad-banner"]',
    '[id*="adcontainer"]',
    '[class*="adsense"]',
    '[id*="ads_bottom"]',
    '[class*="ad-section"]',
    '[class*="adsbox"]',
    '[class*="ad-unit"]',
    '[class*="inline-ad"]',
    '[id*="ad-sidebar"]',
    '[class*="advert-unit"]',
    '[id*="adblocker"]',
    '[class*="ad-overlay"]',
    '[id*="adblock-sidebar"]',
    '[class*="sponsored-content"]',
    '[class*="ad-vertical"]',
    ".sponsored-post",
    "#ad-footer",
    "#ad-header",
    ".ad-background",
    ".video-archive-ad",
    "#topAdv",
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
