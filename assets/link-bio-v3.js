(() => {
  "use strict";

  const CANONICAL_URL = "https://mahmutyildiz-bio.github.io/";
  const params = new URLSearchParams(window.location.search);
  const languageButtons = Array.from(document.querySelectorAll(".language-button[data-language]"));
  const shareButton = document.getElementById("share-button");
  const shareStatus = document.getElementById("share-status");
  const profileTitle = document.getElementById("profile-title");

  let currentLanguage = "en";

  const copy = {
    en: {
      brand: "Mahmut YILDIZ",
      pageTitle: "Mahmut YILDIZ | Official Links",
      officialLinks: "Official links",
      share: "Share",
      shareAria: "Share Profile",
      tagline: "Motion Graphics Designer & Art Director",
      subline: "After Effects, Premiere Pro, Photoshop, Blender 3D, Capcut, Figma",
      portfolioTitle: "Portfolio",
      portfolioDetail: "View all works",
      linkedinTitle: "LinkedIn",
      linkedinDetail: "Professional network",
      cvTitle: "Resume / CV",
      cvDetail: "View and download",
      contactTitle: "Contact",
      contactDetail: "mahmutyldzz5311@gmail.com",
      disclaimer: "Motion Graphics & Art Direction Portfolio.",
      privacy: "Designed for creative professionals",
      shareOpened: "Share menu opened.",
      linkCopied: "Email Copied!",
      copyFailed: "Copy failed."
    },
    tr: {
      brand: "Mahmut YILDIZ",
      pageTitle: "Mahmut YILDIZ | Resmî Bağlantılar",
      officialLinks: "Resmî bağlantılar",
      share: "Paylaş",
      shareAria: "Profili paylaş",
      tagline: "Motion Graphics Designer & Art Director",
      subline: "After Effects, Premiere Pro, Photoshop, Blender 3D, Capcut, Figma",
      portfolioTitle: "Portfolyo",
      portfolioDetail: "Tüm çalışmaları incele",
      linkedinTitle: "LinkedIn",
      linkedinDetail: "Profesyonel ağ",
      cvTitle: "Özgeçmiş / CV",
      cvDetail: "Görüntüle ve indir",
      contactTitle: "İletişim",
      contactDetail: "mahmutyldzz5311@gmail.com",
      disclaimer: "Hareketli Grafik ve Sanat Yönetimi Portfolyosu.",
      privacy: "Yaratıcı profesyoneller için tasarlandı",
      shareOpened: "Paylaşım menüsü açıldı.",
      linkCopied: "Mail Kopyalandı! ✓",
      copyFailed: "Kopyalama başarısız oldu."
    }
  };

  const t = key => copy[currentLanguage][key] || copy.en[key] || key;
  const text = (selector, key) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = t(key);
  };

  const applyLanguage = (language, { persist = false } = {}) => {
    const nextLanguage = language === "tr" ? "tr" : "en";
    currentLanguage = nextLanguage;
    document.documentElement.lang = nextLanguage;

    languageButtons.forEach(button => {
      button.setAttribute("aria-pressed", button.dataset.language === nextLanguage ? "true" : "false");
    });

    profileTitle.textContent = t("brand");
    document.title = t("pageTitle");
    text("#eyebrow-text", "officialLinks");
    text("#share-label-text", "share");
    shareButton.setAttribute("aria-label", t("shareAria"));
    text("#tagline-text", "tagline");
    text("#subline-text", "subline");

    text("#portfolioTitle", "portfolioTitle");
    text("#portfolioDetail", "portfolioDetail");
    
    text("#linkedinTitle", "linkedinTitle");
    text("#linkedinDetail", "linkedinDetail");

    text("#cvTitle", "cvTitle");
    text("#cvDetail", "cvDetail");

    text("#contactTitle", "contactTitle");
    text("#contactDetail", "contactDetail");

    text("#footer-disclaimer", "disclaimer");
    text("#privacy-note", "privacy");

    if (persist) {
      try { localStorage.setItem("mahmut-language", nextLanguage); } catch (_) {}
    }
  };

  const savedLanguage = () => {
    try {
      const value = localStorage.getItem("mahmut-language");
      return value === "tr" || value === "en" ? value : "";
    } catch (_) { return ""; }
  };

  const browserLanguage = () =>
    (navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "en";

  const chooseInitialLanguage = () => {
    const explicit = params.get("lang");
    if (explicit === "tr" || explicit === "en") return explicit;
    const saved = savedLanguage();
    if (saved) return saved;
    return browserLanguage();
  };

  const announce = message => {
    shareStatus.textContent = "";
    window.setTimeout(() => { shareStatus.textContent = message; }, 20);
  };

  const wireEvents = () => {
    languageButtons.forEach(button => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.language, { persist: true });
      });
    });

    const contactBtn = document.getElementById('contactBtn');
    if(contactBtn){
        contactBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = "mahmutyldzz5311@gmail.com";
            const contactTitle = document.getElementById('contactTitle');
            const originalText = contactTitle.innerText;
            try {
                await navigator.clipboard.writeText(email);
                contactTitle.innerText = t("linkCopied");
                setTimeout(() => { contactTitle.innerText = originalText; }, 2000);
            } catch (err) {
                window.location.href = "mailto:" + email;
            }
        });
    }

    shareButton.addEventListener("click", async () => {
      const shareData = { title: t("brand"), text: t("tagline"), url: CANONICAL_URL };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          announce(t("shareOpened"));
          return;
        }
        await navigator.clipboard.writeText(CANONICAL_URL);
        announce(t("linkCopied"));
      } catch (error) {
        if (error && error.name === "AbortError") return;
        try { await navigator.clipboard.writeText(CANONICAL_URL); announce(t("linkCopied")); }
        catch (_) { announce(t("copyFailed")); }
      }
    });
  };

  const initialize = () => {
    applyLanguage(chooseInitialLanguage());
    wireEvents();
  };

  initialize();
})();
