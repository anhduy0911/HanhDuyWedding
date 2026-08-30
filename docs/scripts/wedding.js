/* =========================================================================
   Burgundy Wedding Invitation — interactions
   Vanilla JS: scroll reveals, countdown, gallery lightbox, music, RSVP.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- CONFIG: edit your wedding details here -------------------------- */
  var CONFIG = {
    // Ceremony date/time, fixed to GMT+7 so the countdown is correct for every
    // viewer regardless of their device timezone. (12 Sep 2026, 08:00 GMT+7)
    weddingDate: new Date("2026-09-12T08:00:00+07:00"),
    // Where RSVP responses are sent (opens the guest's mail client)
    rsvpEmail: "vthh0403@gmail.com"
  };

  /* ---- Scroll reveal via IntersectionObserver ------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Countdown ------------------------------------------------------ */
  var cd = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs")
  };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    if (!cd.d) return;
    var diff = CONFIG.weddingDate.getTime() - Date.now();
    if (diff < 0) diff = 0;
    var sec = Math.floor(diff / 1000);
    var days = Math.floor(sec / 86400);
    var hours = Math.floor((sec % 86400) / 3600);
    var mins = Math.floor((sec % 3600) / 60);
    var secs = sec % 60;
    cd.d.textContent = days;
    cd.h.textContent = pad(hours);
    cd.m.textContent = pad(mins);
    cd.s.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);

  /* ---- Music toggle --------------------------------------------------- */
  var player = document.getElementById("player");
  var musicBtn = document.getElementById("music-btn");
  if (player && musicBtn) {
    var playing = false;
    function setMusic(on) {
      playing = on;
      if (on) { player.play().catch(function () {}); }
      else { player.pause(); }
      musicBtn.classList.toggle("playing", on);
      musicBtn.setAttribute("aria-pressed", String(on));
    }
    musicBtn.addEventListener("click", function () { setMusic(!playing); });
    // Try to start music on the first interaction anywhere (browser autoplay policy)
    var kick = function () {
      if (!playing) setMusic(true);
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
  }

  /* ---- Back to top ---------------------------------------------------- */
  var topBtn = document.getElementById("top-btn");
  if (topBtn) {
    window.addEventListener("scroll", function () {
      topBtn.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Gallery lightbox ---------------------------------------------- */
  var lbLinks = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lb = document.getElementById("lightbox");
  if (lb && lbLinks.length) {
    var lbImg = lb.querySelector("img");
    var idx = 0;
    var srcs = lbLinks.map(function (a) { return a.getAttribute("href") || a.querySelector("img").src; });

    function show(i) {
      idx = (i + srcs.length) % srcs.length;
      lbImg.src = srcs[idx];
    }
    function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }

    lbLinks.forEach(function (a, i) {
      a.addEventListener("click", function (ev) { ev.preventDefault(); open(i); });
    });
    lb.querySelector(".lightbox__close").addEventListener("click", close);
    lb.querySelector(".prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (ev) { if (ev.target === lb) close(); });
    document.addEventListener("keydown", function (ev) {
      if (!lb.classList.contains("open")) return;
      if (ev.key === "Escape") close();
      if (ev.key === "ArrowLeft") show(idx - 1);
      if (ev.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---- RSVP form ------------------------------------------------------ */
  var VI = document.documentElement.lang === "vi";
  var T = VI ? {
    subject: "Xác nhận tham dự lễ cưới — ",
    lName: "Họ tên: ",
    lAttend: "Tham dự: ",
    yes: "Có, rất vui được tham dự!",
    no: "Rất tiếc không thể tham dự",
    lGuests: "Số khách: ",
    lMsg: "Lời nhắn: ",
    validate: "Vui lòng nhập họ tên và cho chúng mình biết bạn có tham dự không nhé.",
    thanksYes: "Cảm ơn ", thanksYesEnd: "! Chúng mình rất mong được gặp bạn ♥",
    thanksNo: "Cảm ơn ", thanksNoEnd: " đã phản hồi. Sẽ nhớ bạn nhiều ♥"
  } : {
    subject: "Wedding RSVP — ",
    lName: "Name: ",
    lAttend: "Attending: ",
    yes: "Yes, with joy!",
    no: "Sadly cannot make it",
    lGuests: "Guests: ",
    lMsg: "Message: ",
    validate: "Please enter your name and let us know if you can join.",
    thanksYes: "Thank you, ", thanksYesEnd: "! We can't wait to celebrate with you ♥",
    thanksNo: "Thank you for letting us know, ", thanksNoEnd: ". You'll be missed ♥"
  };

  var form = document.getElementById("rsvp-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var attend = data.get("attend");
      var guests = data.get("guests");
      var note = (data.get("note") || "").toString().trim();
      var msgEl = document.getElementById("rsvp-msg");

      if (!name || !attend) {
        msgEl.textContent = T.validate;
        return;
      }

      var subject = T.subject + name;
      var body =
        T.lName + name + "\n" +
        T.lAttend + (attend === "yes" ? T.yes : T.no) + "\n" +
        T.lGuests + (guests || "1") + "\n" +
        T.lMsg + (note || "-");

      var mailto = "mailto:" + CONFIG.rsvpEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      msgEl.textContent = attend === "yes"
        ? T.thanksYes + name + T.thanksYesEnd
        : T.thanksNo + name + T.thanksNoEnd;

      // Open the mail client so the response actually reaches the couple.
      window.location.href = mailto;
      form.reset();
    });
  }

  /* ---- QR popup when a guest can't attend ---------------------------- */
  var qrModal = document.getElementById("qr-modal");
  var attendNo = document.getElementById("attend-no");
  if (qrModal && attendNo) {
    var openQR = function () {
      qrModal.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    var closeQR = function () {
      qrModal.classList.remove("open");
      document.body.style.overflow = "";
    };
    // Fire whenever the "can't attend" option becomes selected...
    attendNo.addEventListener("change", function () { if (attendNo.checked) openQR(); });
    // ...and also on a repeat click of its label (change won't refire).
    var noLabel = document.querySelector('label[for="attend-no"]');
    if (noLabel) {
      noLabel.addEventListener("click", function () {
        setTimeout(function () { if (attendNo.checked) openQR(); }, 0);
      });
    }
    var qrClose = qrModal.querySelector(".qr-modal__close");
    if (qrClose) qrClose.addEventListener("click", closeQR);
    qrModal.addEventListener("click", function (ev) { if (ev.target === qrModal) closeQR(); });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && qrModal.classList.contains("open")) closeQR();
    });
  }

  /* ---- Fill dynamic year in footer ----------------------------------- */
  var yearEl = document.getElementById("cal-year");
  if (yearEl) yearEl.textContent = CONFIG.weddingDate.getFullYear();
})();
