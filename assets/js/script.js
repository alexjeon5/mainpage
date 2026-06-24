/* =========================================================
   HANGGOK — Paper Editorial
   - 테마 토글 (dark / light)
   - 타임라인 / 향후 계획 동적 로딩 (assets/data/*.json)
   - 다국어 (ko / en)
   - 준비 중 모달 (srv-error)
   ========================================================= */
(function () {
  "use strict";

  var THEME_KEY = "hanggok-theme";
  var LANG_KEY = "hanggok-lang";
  var root = document.documentElement; // <html data-theme="..." lang="...">

  /* ---------- 경로 계산 (하위 폴더에서도 동작) ---------- */
  function getBasePath() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src") || "";
      if (src.indexOf("assets/js/script.js") !== -1) {
        return src.replace("assets/js/script.js", "");
      }
    }
    return "";
  }
  var basePath = getBasePath();

  /* ========================================================
     1. 테마 (dark / light)
     ======================================================== */
  function getInitialTheme() {
    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === "dark" || saved === "light") return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#161512" : "#f7f5f0");
    var label = document.getElementById("theme-label");
    if (label) label.textContent = theme === "dark" ? "Light" : "Dark";
  }

  applyTheme(getInitialTheme()); // 깜빡임 방지 위해 즉시 적용

  /* ========================================================
     2. 다국어 (i18n)
     ======================================================== */
  function getNested(obj, path) {
    var keys = path.split(".");
    var val = obj;
    for (var i = 0; i < keys.length; i++) {
      if (val && val[keys[i]] !== undefined) {
        val = val[keys[i]];
      } else {
        return null;
      }
    }
    return val;
  }

  function loadJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("Not found: " + url);
      return res.json();
    });
  }

  function applyLanguage(lang) {
    root.setAttribute("lang", lang);
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}

    // 언어 버튼 활성 상태 표시
    var btns = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("active", btns[i].getAttribute("data-lang") === lang);
    }

    loadJSON(basePath + "assets/lang/" + lang + ".json")
      .then(function (dict) {
        var nodes = document.querySelectorAll("[data-i18n]");
        for (var j = 0; j < nodes.length; j++) {
          var key = nodes[j].getAttribute("data-i18n");
          var text = getNested(dict, key);
          if (text != null) nodes[j].innerHTML = text;
        }
      })
      .catch(function (err) { console.error("i18n error:", err); });

    // 타임라인/계획도 해당 언어로 다시 로드
    loadTimeline(lang);
  }

  /* ========================================================
     3. 타임라인 / 향후 계획 (동적 로딩)
     ======================================================== */
  function loadTimeline(lang) {
    var tlBox = document.getElementById("timeline-list");
    var plansBox = document.getElementById("plans-list");
    if (!tlBox) return;

    var fileName = lang === "en" ? "timeline_en.json" : "timeline.json";

    loadJSON(basePath + "assets/data/" + fileName)
      .then(function (data) {
        // 타임라인 렌더
        var tlHtml = "";
        (data.timeline || []).forEach(function (item) {
          tlHtml +=
            '<div class="tl-row">' +
              '<span class="tl-date">' + item.date + "</span>" +
              '<span class="tl-text">' + item.text + "</span>" +
            "</div>";
        });
        tlBox.innerHTML = tlHtml;

        // 향후 계획 렌더
        if (plansBox) {
          var pHtml = "";
          (data.plans || []).forEach(function (text) {
            pHtml += '<li class="plans-item">' + text + "</li>";
          });
          plansBox.innerHTML = pHtml;
        }
      })
      .catch(function (err) {
        console.error("Timeline load error:", err);
        var msg = lang === "en" ? "Failed to load timeline." : "타임라인을 불러올 수 없습니다.";
        tlBox.innerHTML = '<div class="tl-loading">' + msg + "</div>";
      });
  }

  /* ========================================================
     4. 모달 (srv-error 준비중 / admin-warn 보안경고)
     ======================================================== */
  function makeModal(overlayId, modalId, closeBtnId) {
    var overlay = document.getElementById(overlayId);
    var modal = document.getElementById(modalId);
    var closeBtn = document.getElementById(closeBtnId);
    if (!overlay || !modal) return null;

    function toggle(show) {
      var action = show ? "add" : "remove";
      overlay.classList[action]("active");
      modal.classList[action]("active");
      document.body.style.overflow = show ? "hidden" : "";
      if (show && closeBtn) setTimeout(function () { closeBtn.focus(); }, 50);
    }

    if (closeBtn) closeBtn.addEventListener("click", function () { toggle(false); });
    overlay.addEventListener("click", function () { toggle(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("active")) toggle(false);
    });

    return { toggle: toggle };
  }

  var srvErrorModal = null;

  function bindSrvErrorTriggers() {
    if (!srvErrorModal) return;
    var triggers = document.querySelectorAll(".srv-error");
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].dataset.bound) continue;
      triggers[i].dataset.bound = "1";
      triggers[i].addEventListener("click", function (e) {
        e.preventDefault();
        srvErrorModal.toggle(true);
      });
    }
  }

  /* ========================================================
     4-b. Admin 페이지 — 서비스 목록 동적 렌더
     ======================================================== */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function loadAdminServices() {
    var rootEl = document.getElementById("admin-root");
    if (!rootEl) return;

    loadJSON(basePath + "assets/data/admin-services.json")
      .then(function (data) {
        var html = "";
        (data.groups || []).forEach(function (group, gi) {
          var num = ("0" + (gi + 1)).slice(-2);
          html += '<section class="section admin-section">';
          html += '<div class="sec-head">';
          html += '<span class="sec-num">' + num + "</span>";
          html += '<h2 class="sec-title">' + escapeHtml(group.server) + "</h2>";
          html += '<span class="sec-sub">' + escapeHtml(group.label) + "</span>";
          html += "</div>";
          html += '<div class="portfolio-grid">';

          (group.services || []).forEach(function (svc) {
            var off = svc.status === "offline";
            var tagText = off ? "OFFLINE" : "ONLINE";
            var classAttr = "card admin-card" + (off ? " card-soon srv-error" : "");
            var hrefAttr, relAttr;
            if (off) {
              hrefAttr = "#";
              relAttr = "";
            } else {
              hrefAttr = svc.url;
              relAttr = svc.url.charAt(0) === "#" || svc.url.indexOf("../") === 0
                ? ""
                : ' target="_blank" rel="noopener"';
            }
            html += '<a class="' + classAttr + '" href="' + escapeHtml(hrefAttr) + '"' + relAttr + ">";
            html += '<div class="thumb">';
            html += '<span class="thumb-cap">' + escapeHtml(svc.name).toUpperCase() + "</span>";
            html += '<span class="thumb-tag' + (off ? " off" : "") + '">' + tagText + "</span>";
            html += "</div>";
            html += '<div class="card-title">' + escapeHtml(svc.name) + "</div>";
            html += '<div class="card-desc">' + escapeHtml(svc.desc) + "</div>";
            html += "</a>";
          });

          html += "</div></section>";
        });
        rootEl.innerHTML = html;

        // 새로 만든 .srv-error 요소에 모달 트리거 연결
        bindSrvErrorTriggers();
      })
      .catch(function (err) {
        console.error("Admin services load error:", err);
        rootEl.innerHTML = '<p class="tl-loading" style="padding:40px 0;">서비스 목록을 불러올 수 없습니다.</p>';
      });
  }

  /* ========================================================
     5. 초기화
     ======================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.getAttribute("data-theme") || "light");

    // 테마 토글
    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      });
    }

    // 언어 버튼
    var langBtns = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener("click", function () {
        applyLanguage(this.getAttribute("data-lang"));
      });
    }

    // 초기 언어 적용
    var savedLang;
    try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) {}
    applyLanguage(savedLang === "en" ? "en" : "ko");

    // 모달 초기화
    srvErrorModal = makeModal("srv-error-overlay", "srv-error", "srv-error-close-btn");
    bindSrvErrorTriggers();

    // Admin 페이지 전용 처리
    if (document.body.dataset.page === "admin") {
      loadAdminServices();
      var adminWarn = makeModal("admin-warn-overlay", "admin-warn", "admin-warn-close-btn");
      if (adminWarn) adminWarn.toggle(true);
    }
  });
})();
