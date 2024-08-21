function ytBlocker() {
  const adblocker = true;
  const removePopup = false;
  const debugMessages = true;
  const fixTimestamps = true;
  let currentUrl = window.location.href;
  let isVideoPlayerModified = false;

  if (adblocker) removeAds();
  if (removePopup) popupRemover();
  if (fixTimestamps) timestampFix();

  // Remove Them pesski popups
  function popupRemover() {
    setInterval(() => {
      const modalOverlay = document.querySelector(
        "tp-yt-iron-overlay-backdrop"
      );
      const popup = document.querySelector(
        ".style-scope ytd-enforcement-message-view-model"
      );
      const popupButton = document.getElementById("dismiss-button");

      var video = document.querySelector("video");

      const bodyStyle = document.body.style;
      bodyStyle.setProperty("overflow-y", "auto", "important");

      if (modalOverlay) {
        modalOverlay.removeAttribute("opened");
        modalOverlay.remove();
      }

      if (popup) {
        if (popupButton) popupButton.click();

        popup.remove();
        video.play();

        setTimeout(() => {
          video.play();
        }, 500);
      }
      // Check if the video is paused after removing the popup
      if (!video.paused) return;
      // UnPause The Video
      video.play();
    }, 1000);
  }

  // undetected adblocker method
  // undetected adblocker method
  function removeAds() {
    setInterval(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        isVideoPlayerModified = false;
        clearAllPlayers();
        removePageAds();
      }

      // Fix for youtube shorts
      if (window.location.href.includes("shorts")) {
        return;
      }

      if (isVideoPlayerModified) {
        removeAllDuplicateVideos();
        return;
      }

      var video = document.querySelector("video");
      if (video) video.volume = 0;
      if (video) video.pause();
      if (video) video.remove();
      if (!clearAllPlayers()) {
        return;
      }

      /**
       * remove the "Ad blockers violate YouTube's Terms of Service" screen for safari
       */
      let errorScreen = document.querySelector("#error-screen");
      if (errorScreen) {
        errorScreen.remove();
      }

      //
      // Get the video ID from the URL
      //

      let videoID = "";
      let playList = "";
      let timeStamp = "";
      const url = new URL(window.location.href);
      const urlParams = new URLSearchParams(url.search);

      if (urlParams.has("v")) {
        videoID = urlParams.get("v");
      } else {
        const pathSegments = url.pathname.split("/");
        const liveIndex = pathSegments.indexOf("live");
        if (liveIndex !== -1 && liveIndex + 1 < pathSegments.length) {
          videoID = pathSegments[liveIndex + 1];
        }
      }

      if (urlParams.has("list")) {
        playList = "&listType=playlist&list=" + urlParams.get("list");
      }

      if (urlParams.has("t")) {
        timeStamp = "&start=" + urlParams.get("t").replace("s", "");
      }

      if (!videoID) {
        return null;
      }

      //
      // Create new frame for the video
      //

      const startOfUrl = "https://www.youtube-nocookie.com/embed/";

      const endOfUrl = "?autoplay=1&modestbranding=1&rel=0";
      const finalUrl = startOfUrl + videoID + endOfUrl;

      const iframe = document.createElement("iframe");

      iframe.setAttribute("src", finalUrl);
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      );
      iframe.setAttribute("allowfullscreen", true);
      iframe.setAttribute("mozallowfullscreen", "mozallowfullscreen");
      iframe.setAttribute("msallowfullscreen", "msallowfullscreen");
      iframe.setAttribute("oallowfullscreen", "oallowfullscreen");
      iframe.setAttribute("webkitallowfullscreen", "webkitallowfullscreen");

      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.position = "absolute";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.zIndex = "9999";
      iframe.style.pointerEvents = "all";

      const videoPlayerElement = document.querySelector(".html5-video-player");
      videoPlayerElement.appendChild(iframe);

      isVideoPlayerModified = true;
    }, 500);
    removePageAds();
  }
  //
  // logic functionm
  //

  function removeAllDuplicateVideos() {
    const videos = document.querySelectorAll("video");

    videos.forEach((video) => {
      if (video.src.includes("www.youtube.com")) {
        video.muted = true;
        video.pause();
        video.addEventListener("volumechange", function () {
          if (!video.muted) {
            video.muted = true;
            video.pause();
          }
        });
        video.addEventListener("play", function () {
          video.pause();
        });
      }
    });
  }

  function clearAllPlayers() {
    const videoPlayerElements = document.querySelectorAll(
      ".html5-video-player"
    );

    if (videoPlayerElements.length === 0) {
      return false;
    }

    videoPlayerElements.forEach((videoPlayerElement) => {
      const iframes = videoPlayerElement.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        iframe.remove();
      });
    });

    return true;
  }

  //removes ads on the page (not video player ads)
  function removePageAds() {
    const sponsor = document.querySelectorAll(
      "div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy"
    );
    const style = document.createElement("style");

    style.textContent = `
            ytd-action-companion-ad-renderer,
            ytd-display-ad-renderer,
            ytd-video-masthead-ad-advertiser-info-renderer,
            ytd-video-masthead-ad-primary-video-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-ad-slot-renderer,
            yt-about-this-ad-renderer,
            yt-mealbar-promo-renderer,
            ytd-statement-banner-renderer,
            ytd-ad-slot-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-banner-promo-renderer-background
            statement-banner-style-type-compact,
            .ytd-video-masthead-ad-v3-renderer,
            div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
            div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
            div#main-container.style-scope.ytd-promoted-video-renderer,
            div#player-ads.style-scope.ytd-watch-flexy,
            ad-slot-renderer,
            ytm-promoted-sparkles-web-renderer,
            masthead-ad,
            tp-yt-iron-overlay-backdrop,
            #masthead-ad {
                display: none !important;
            }
        `;

    document.head.appendChild(style);

    sponsor?.forEach((element) => {
      if (element.getAttribute("id") === "rendering-content") {
        element.childNodes?.forEach((childElement) => {
          if (
            childElement?.data.targetId &&
            childElement?.data.targetId !==
              "engagement-panel-macro-markers-description-chapters"
          ) {
            //Skipping the Chapters section
            element.style.display = "none";
          }
        });
      }
    });
  }

  function changeTimestamp(timestamp) {
    const videoPlayerElements = document.querySelectorAll(
      ".html5-video-player"
    );
    videoPlayerElements.forEach((videoPlayerElement) => {
      const iframes = videoPlayerElement.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        if (iframe.src.includes("&start=")) {
          iframe.src = iframe.src.replace(/&start=\d+/, "&start=" + timestamp);
        } else {
          iframe.src += "&start=" + timestamp;
        }
      });
    });
  }

  function timestampFix() {
    document.addEventListener("click", function (event) {
      const target = event.target;

      if (
        target.classList.contains("yt-core-attributed-string__link") &&
        target.href.includes("&t=")
      ) {
        event.preventDefault();
        const timestamp = target.href.split("&t=")[1].split("s")[0];
        changeTimestamp(timestamp);
      }
    });
  }

  function observerCallback(mutations) {
    let isVideoAdded = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) => node.tagName === "VIDEO")
    );

    if (isVideoAdded) {
      if (window.location.href.includes("shorts")) {
        return;
      }
      removeAllDuplicateVideos();
    }
  }

  const observer = new MutationObserver(observerCallback);
  observer.observe(document.body, { childList: true, subtree: true });
}

window.ytBlocker = ytBlocker;
