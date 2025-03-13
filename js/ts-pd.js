;(function ($) {
  // 動態添加 Google 字體連結
  var googleFontLink = document.createElement("link");
  googleFontLink.rel = "preconnect";
  googleFontLink.href = "https://fonts.googleapis.com";
  document.head.appendChild(googleFontLink);

  var googleFontLink2 = document.createElement("link");
  googleFontLink2.rel = "preconnect";
  googleFontLink2.href = "https://fonts.gstatic.com";
  googleFontLink2.crossorigin = "anonymous";
  document.head.appendChild(googleFontLink2);

  var googleFontLink3 = document.createElement("link");
  googleFontLink3.rel = "stylesheet";
  googleFontLink3.href =
    "https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Figtree:ital,wght@0,300..900;1,300..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap";
  document.head.appendChild(googleFontLink3);

  // 動態添加自定 CSS
  var customCSS = document.createElement("link");
  customCSS.rel = "stylesheet";
  customCSS.type = "text/css";
  customCSS.href = "https://cdn.jsdelivr.net/gh/lmybs112/ts-pd-iframe@1.0.2/css/iframe_ai_pd_style.css";
  document.head.appendChild(customCSS);

  $(function () {
    console.log("DOM is ready");
    $(window).on("message", function (event) {
      var origin = event.originalEvent.origin;
      // if (origin !== 'https://iframe所在的網址') return; // 避免跨域攻擊
      // 處理從 <iframe> 來的訊息
      // console.log("接收到來自 iframe 的訊息：", event.originalEvent.data);
      if (event.originalEvent.data.type === "result") {
        if (event.originalEvent.data.value) {
          $(".ai-pd-container__trigger").addClass(
            "ai-pd-container__trigger--result"
          );
        } else {
          $(".ai-pd-container__trigger").removeClass(
            "ai-pd-container__trigger--result"
          );
        }
      }
      if (event.originalEvent.data.type === "closeModal") {
        if (event.originalEvent.data.value) {
          $("#inffits_cblock--pd--overlay").fadeOut();
          $(".ai-pd-container__trigger").toggleClass(
            "ai-pd-container__trigger--search ai-pd-container__trigger--close"
          );
        }
      }
    });
    // 添加 html template
    // https://ts-iframe-8ysy.vercel.app
    var aiSearchPdTemplate = `
        <div class="ai-pd-container">
        <button
            class="ai-pd-container__trigger ai-pd-container__trigger--search"
            type="button"
        >
            <div class="ai-pd-container__icon"></div>
            <img class="ai-pd-container__icon--alert" src="https://raw.githubusercontent.com/infFITSDevelopment/pop-ad/refs/heads/main/icon-alert.svg"></img>
        </button>
            <div
  style="
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    transform: none;
  "
  id="inffits_cblock--pd--overlay"
>
  <div
    id="inffits_cblock--pd"
    style="
      z-index: 60;
      display: block;
      position: absolute; inset: 0;
    "
  >
    <div id="tryon--pd" style="height: 100%;width:100%;display:flex;justify-content:center;align-items:center;">
    <iframe
        id="inffits_tryon--pd_window"
        style="
          height: 100%;
            width: 100%;
            visibility: visible;
            position: relative;
            border: none;
            outline: none;
            z-index: 14;
            max-width: 95vw;
            margin: 0 auto;
        "
        src="${
          window.location.port === "5500"
            ? "./iframe_container_module.html"
            : "https://ts-iframe-8ysy.vercel.app/iframe_container_module.html"
        }"
      ></iframe>

    </div>
  </div>
</div>
</div>
<style media="screen and (min-width: 480px)">
  #inffits_cblock--pd {
    position: fixed;
    right: 0;
    bottom: 0;
    height: 700px;
    width: 480px !important;
  }
  #tryon--pd {
    margin: auto;
    height: 700px;
    width: 480px !important;
  }
    </style>

<style media="screen and (min-width: 355px) and (max-width: 479px)">
  #inffits_cblock--pd {
    position: fixed;
    right: 0;
    bottom: 0;
    // height: 580px;
    // width: 355px !important;
  }
  #tryon--pd {
    margin: auto;
    // height: 580px;
    // height: 100vh;
    width: 355px !important;
  }
</style>
  `;
    document.body.insertAdjacentHTML("beforeend", aiSearchPdTemplate);

    // 獲取 iframe 的 contentWindow
    const iframeElement = document.getElementById("inffits_tryon--pd_window");
    if (iframeElement) {
      const iframe_container = iframeElement.contentWindow;

      // 確保 iframe 加載完成再傳送 postMessage
      iframeElement.onload = () => {
          const iframe_preview_obj = {
            id: "ODM_All",
            header: "from_preview",
            brand: "ODM",
          };
          // 傳送 postMessage 到 iframe
          iframe_container.postMessage(iframe_preview_obj, "*");
      };
    } else {
      console.error("iframe 元素未找到，無法傳送 postMessage");
    }

    $(".ai-pd-container__trigger").on("pointerdown", function (event) {
      if ($(this).hasClass("ai-pd-container__trigger--search")) {
        $("#inffits_cblock--pd--overlay").fadeIn();
      } else {
        $("#inffits_cblock--pd--overlay").fadeOut();
      }
      $(this).toggleClass(
        "ai-pd-container__trigger--search ai-pd-container__trigger--close"
      );
    });
    $("#inffits_cblock--pd--overlay").on("pointerdown", function (event) {
      $("#inffits_cblock--pd--overlay").fadeOut();
      $(".ai-pd-container__trigger").toggleClass(
        "ai-pd-container__trigger--search ai-pd-container__trigger--close"
      );
    });

    var breakpoint = 992;

    // 監聽窗口大小變化
    window.addEventListener("resize", handleWindowResize);

    // 首次載入時執行檢查
    handleWindowResize();
    function handleWindowResize() {
      // 取得當前視窗寬度
      var windowWidth = window.innerWidth;

      // 當視窗寬度大於等於 992px (桌面版)
      if (windowWidth >= breakpoint) {
      } else {
      }
    }
  });
})(jQuery);
