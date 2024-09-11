let videoId = null;
let isSwitchedToEmbed = false;
function ytBlocker() {
  const currentValue = new URLSearchParams(window.location.search).get("v");

  if (currentValue !== videoId) {
    videoId = currentValue;
    const existingIframe = document.querySelector(".youtube-main-embed-video");
    if (existingIframe) existingIframe.remove();
    if (isSwitchedToEmbed) updateEmbed();
  } else {
    const player = document.querySelector("#movie_player");
    let hasAd = false;
    video = null;

    if (player) {
      hasAd = player.classList.contains("ad-showing");
      video = player.querySelector("video.html5-main-video");
    }

    if (hasAd) {
      const skipButton = document.querySelector(`
            .ytp-skip-ad-button,
            .ytp-ad-skip-button,
            .ytp-ad-skip-button-modern
        `);
      if (skipButton) {
        skipButton.click();
        skipButton.remove();
      } else if (video && video.src) {
        video.currentTime = 9999;
      }
    }

    if (video) {
      video.addEventListener("pause", handlePauseVideo);
      video.addEventListener("mouseup", allowPauseVideo);
    }

    const adBlockerWarningDialog = document.querySelector(
      "tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)"
    );

    if (adBlockerWarningDialog) {
      adBlockerWarningDialog.remove();
    }
    const adBlockerWarningInner = document.querySelector(
      ".yt-playability-error-supported-renderers"
    );
    if (adBlockerWarningInner) {
      adBlockerWarningInner.remove();
      if (document.getElementsByTagName("ytd-shorts").length === 0) {
        console.log("Fallback triggered");
        updateEmbed();
        isSwitchedToEmbed = true;
      }
    }
    const playButton = document.querySelector("button.ytp-play-button");
    if (playButton) {
      playButton.addEventListener("click", allowPauseVideo);
    }

    fineScrubbing = document.querySelector(".ytp-fine-scrubbing");

    const adShortVideos = document.querySelectorAll(
      "ytd-reel-video-renderer:has(.ytd-ad-slot-renderer)"
    );
    for (const adShortVideo of adShortVideos) {
      adShortVideo.remove();
    }
  }
}
function updateEmbed() {
  if (videoId) {
    // Create the embed iframe
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.classList.add("youtube-main-embed-video");
    iframe.width = "100%";
    iframe.style.height = "400px";
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    const videoContainer = document.querySelector("#player");
    if (videoContainer) {
      videoContainer.innerHTML = "";
      videoContainer.appendChild(iframe);
    }
  }
}
function allowPauseVideo() {
  isAllowPauseVideo = true;
  window.clearTimeout(allowPauseVideoTimeoutId);
  allowPauseVideoTimeoutId = window.setTimeout(disallowPauseVideo, 500);
}

function disallowPauseVideo() {
  isAllowPauseVideo = false;
  window.clearTimeout(allowPauseVideoTimeoutId);
}

function handlePauseVideo() {
  if (isAllowPauseVideo) {
    disallowPauseVideo();
    return;
  }
  if (document.hidden) return;
  if (fineScrubbing?.checkVisibility()) return;
  if (video) {
    if (video.duration - video.currentTime < 0.1) return;
    video.play();
  }
}

function handleGlobalKeyDownKeyUp(event) {
  if (document.activeElement?.matches("input, textarea, select")) return;
  if (event.type === "keydown") {
    if (["KeyK", "MediaPlayPause"].includes(event.code)) {
      allowPauseVideo();
    }
  } else {
    if (event.code === "Space") {
      allowPauseVideo();
    }
  }
}

let video = null;
let fineScrubbing = null;
let isAllowPauseVideo = false;
let allowPauseVideoTimeoutId = 0;

if (window.MutationObserver) {
  const observer = new MutationObserver(ytBlocker);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class", "src"],
    childList: true,
    subtree: true,
  });
} else {
  window.setInterval(ytBlocker, 500);
}
ytBlocker();

window.addEventListener("keydown", handleGlobalKeyDownKeyUp);
window.addEventListener("keyup", handleGlobalKeyDownKeyUp);

const style = document.createElement("style");
style.textContent = `
    #player-ads,
    #masthead-ad,
    #panels:has(ytd-ads-engagement-panel-content-renderer),
    ytd-ad-slot-renderer,
    ytd-rich-item-renderer:has(.ytd-ad-slot-renderer),
    ytd-reel-video-renderer:has(.ytd-ad-slot-renderer),
    tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model),
    .yt-mealbar-promo-renderer,
    ytd-action-companion-ad-renderer,
    ytd-display-ad-renderer,
    ytd-video-masthead-ad-advertiser-info-renderer,
    ytd-video-masthead-ad-primary-video-renderer,
    ytd-in-feed-ad-layout-renderer,
    yt-about-this-ad-renderer,
    ytd-statement-banner-renderer,
    ytd-banner-promo-renderer-background,
    statement-banner-style-type-compact,
    .ytd-video-masthead-ad-v3-renderer,
    div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
    div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
    div#main-container.style-scope.ytd-promoted-video-renderer,
    div#player-ads.style-scope.ytd-watch-flexy,
    ad-slot-renderer,
    ytm-promoted-sparkles-web-renderer,
    tp-yt-iron-overlay-backdrop {
        display: none !important;
    },
    ytm-companion-ad-renderer,
    #masthead-ad {
        display: none !important;
    }`;

document.head.appendChild(style);

window.ytBlocker = ytBlocker;
