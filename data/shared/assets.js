(function () {
  var localAssetMap = {
    "A3HMG-003KH.jpg": "./userfiles/thumbs/A3HMG-003KH.jpg",
    "A514-56P-580G-9.jpg": "./userfiles/thumbs/A514-56P-580G-9.jpg",
    "A515-58P-77Y4-Ci7-1355U-1.png":
      "./userfiles/thumbs/A515-58P-77Y4-Ci7-1355U-1.png",
    "accessories-icon.png": "./images/accessories-icon.png",
    "acer-logo.png": "./userfiles/thumbs/acer-logo.png",
    "adata-logo.png": "./userfiles/thumbs/adata-logo.png",
    "alantek-logo.png": "./userfiles/thumbs/alantek-logo.png",
    "all-categories-icon.png": "./images/all-categories-icon.png",
    "AOC-AIO-23.8.jpg": "./userfiles/thumbs/AOC-AIO-23.8.jpg",
    "aoc-logo.png": "./userfiles/thumbs/aoc-logo.png",
    "apc-logo.png": "./userfiles/thumbs/apc-logo.png",
    "Archer-AX73.jpg": "./userfiles/thumbs/Archer-AX73.jpg",
    "archer-c80-6.jpg": "./userfiles/thumbs/archer-c80-6.jpg",
    "asus-logo.png": "./userfiles/thumbs/asus-logo.png",
    "bixolon-logo.png": "./userfiles/thumbs/bixolon-logo.png",
    "brother-logo.png": "./userfiles/thumbs/brother-logo.png",
    "camera-icon.png": "./images/camera-icon.png",
    "canon-gx7070.png": "./userfiles/thumbs/canon-gx7070.png",
    "canon-logo.png": "./userfiles/thumbs/canon-logo.png",
    "cisco-logo.png": "./userfiles/thumbs/cisco-logo.png",
    "clearlyip-logo.png": "./userfiles/thumbs/clearlyip-logo.png",
    "commscope-logo.png": "./userfiles/thumbs/commscope-logo.png",
    "component-icon.png": "./images/component-icon.png",
    "CS-H8c.jpg": "./userfiles/thumbs/CS-H8c.jpg",
    "dahua-logo.png": "./userfiles/thumbs/dahua-logo.png",
    "DCP-T830DW.jpg": "./userfiles/thumbs/DCP-T830DW.jpg",
    "Deco-BE25(3-pack).jpg": "./userfiles/thumbs/Deco-BE25(3-pack).jpg",
    "Dell- Alienware-Core-i9-14900F-16GB-1.png":
      "./userfiles/thumbs/Dell-%2520Alienware-Core-i9-14900F-16GB-1.png",
    "dell1400-x-560.jpg": "./userfiles/dell1400-x-560.jpg",
    "Dell-7440.jpg": "./userfiles/thumbs/Dell-7440.jpg",
    "dell-Aurora-R16-8.jpg": "./userfiles/thumbs/dell-Aurora-R16-8.jpg",
    "Dell-DC16250.jpg": "./userfiles/thumbs/Dell-DC16250.jpg",
    "Dell-E2225H.jpg": "./userfiles/thumbs/Dell-E2225H.jpg",
    "Dell-Latitude-5450.jpg": "./userfiles/thumbs/Dell-Latitude-5450.jpg",
    "Dell-Plus-7020.jpg": "./userfiles/thumbs/Dell-Plus-7020.jpg",
    "desktop-icon.png": "./images/desktop-icon.png",
    "DH-IPC-HFW2849TL-S-PRO.jpg":
      "./userfiles/thumbs/DH-IPC-HFW2849TL-S-PRO.jpg",
    "diamond-network-logo.png": "./userfiles/thumbs/diamond-network-logo.png",
    "d-link-logo.png": "./userfiles/thumbs/d-link-logo.png",
    "DS-2CD1043G2-LIUF-4MP.jpg": "./userfiles/thumbs/DS-2CD1043G2-LIUF-4MP.jpg",
    "DS-2CD1123G2-LIUF.jpg": "./userfiles/thumbs/DS-2CD1123G2-LIUF.jpg",
    "DS-3WR18X.jpg": "./userfiles/thumbs/DS-3WR18X.jpg",
    "DS-K1T105AM.jpg": "./userfiles/thumbs/DS-K1T105AM.jpg",
    "DS-K1T804AMF.jpg": "./userfiles/thumbs/DS-K1T804AMF.jpg",
    "dtech-logo.png": "./userfiles/thumbs/dtech-logo.png",
    "eaton-logo.png": "./userfiles/thumbs/eaton-logo.png",
    "EB-FH54.jpg": "./userfiles/thumbs/EB-FH54.jpg",
    "EC24250-Touch.jpg": "./userfiles/thumbs/EC24250-Touch.jpg",
    "ECT1250(1).jpg": "./userfiles/thumbs/ECT1250(1).jpg",
    "edge-core-logo.png": "./userfiles/thumbs/edge-core-logo.png",
    "Epson-L15150.jpg": "./userfiles/thumbs/Epson-L15150.jpg",
    "Epson-L6291.jpg": "./userfiles/thumbs/Epson-L6291.jpg",
    "epson-logo.png": "./userfiles/thumbs/epson-logo.png",
    "Ezviz-CS-H8.jpg": "./userfiles/thumbs/Ezviz-CS-H8.jpg",
    "ezviz-logo.png": "./userfiles/thumbs/ezviz-logo.png",
    "EZVIZ-TY1.jpg": "./userfiles/thumbs/EZVIZ-TY1.jpg",
    "fingerprint-icon.png": "./images/fingerprint-icon.png",
    "Gaming-Tower-17IRR9.jpg": "./userfiles/thumbs/Gaming-Tower-17IRR9.jpg",
    "gigabyte-logo.png": "./userfiles/thumbs/gigabyte-logo.png",
    "Hik-DS-2CD1057G0-LUF.jpg": "./userfiles/thumbs/Hik-DS-2CD1057G0-LUF.jpg",
    "hikvision-logo.png": "./userfiles/thumbs/hikvision-logo.png",
    "honeywell-logo.png": "./userfiles/thumbs/honeywell-logo.png",
    "HP-2602sdw.jpg": "./userfiles/thumbs/HP-2602sdw.jpg",
    "hp-logo.png": "./userfiles/thumbs/hp-logo.png",
    "huawei-logo.png": "./userfiles/thumbs/huawei-logo.png",
    "iClock9000-G.jpg": "./userfiles/thumbs/iClock9000-G.jpg",
    "Inspiron-3530-i3.jpg": "./userfiles/thumbs/Inspiron-3530-i3.jpg",
    "IPC-HFW1439TC1-SA-IL.jpg": "./userfiles/thumbs/IPC-HFW1439TC1-SA-IL.jpg",
    "i-pro-logo.png": "./userfiles/thumbs/i-pro-logo.png",
    "kaspersky-logo.png": "./userfiles/thumbs/kaspersky-logo.png",
    "L11050.jpg": "./userfiles/thumbs/L11050.jpg",
    "laptop-icon.png": "./images/laptop-icon.png",
    "LEGEND-710-512GB-1.jpg": "./userfiles/thumbs/LEGEND-710-512GB-1.jpg",
    "Lenovo-14IMH9.jpg": "./userfiles/thumbs/Lenovo-14IMH9.jpg",
    "Lenovo-L15-1.jpg": "./userfiles/thumbs/Lenovo-L15-1.jpg",
    "lenovo-logo.png": "./userfiles/thumbs/lenovo-logo.png",
    "Lenovo-M70t-i5.jpg": "./userfiles/thumbs/Lenovo-M70t-i5.jpg",
    "link_american_standard-logo.png":
      "./userfiles/thumbs/link_american_standard-logo.png",
    "linkbasic-logo.png": "./userfiles/thumbs/linkbasic-logo.png",
    "logitech-logo.png": "./userfiles/thumbs/logitech-logo.png",
    "MFP-3103fdw.jpg": "./userfiles/thumbs/MFP-3103fdw.jpg",
    "MFP-4303FDW.jpg": "./userfiles/thumbs/MFP-4303FDW.jpg",
    "microsoft-logo.png": "./userfiles/thumbs/microsoft-logo.png",
    "mikrotik-logo.png": "./userfiles/thumbs/mikrotik-logo.png",
    "Modern-14-F13MG.jpg": "./userfiles/thumbs/Modern-14-F13MG.jpg",
    "monitor-icon.png": "./images/monitor-icon.png",
    "msi-logo.png": "./userfiles/thumbs/msi-logo.png",
    "nec-logo.png": "./userfiles/thumbs/nec-logo.png",
    "network-icon.png": "./images/network-icon.png",
    "OptiPlex-7420-AIO.jpg": "./userfiles/thumbs/OptiPlex-7420-AIO.jpg",
    "panasonic-logo.png": "./userfiles/thumbs/panasonic-logo.png",
    "pos-icon.png": "./images/pos-icon.png",
    "posiflex-logo.png": "./userfiles/thumbs/posiflex-logo.png",
    "PRC2402M-Prolink.jpg": "./userfiles/thumbs/PRC2402M-Prolink.jpg",
    "printer-icon.png": "./images/printer-icon.png",
    "Pro-14-PA14250.jpg": "./userfiles/thumbs/Pro-14-PA14250.jpg",
    "PRO700SFC-UPS.png": "./userfiles/thumbs/PRO700SFC-UPS.png",
    "prolink-logo.png": "./userfiles/thumbs/prolink-logo.png",
    "rack-network.png": "./images/rack-network.png",
    "RG-EW3200GX-PRO.jpg": "./userfiles/thumbs/RG-EW3200GX-PRO.jpg",
    "RG-NBS3100-24GT4SFP-V2-1.jpg":
      "./userfiles/thumbs/RG-NBS3100-24GT4SFP-V2-1.jpg",
    "Root-IT-Support-Logo.png": "./userfiles/logo/Root-IT-Support-Logo.png",
    "Router-RB4011iGS.jpg": "./userfiles/thumbs/Router-RB4011iGS.jpg",
    "Ruijie-RG-RAP2200(E).jpg": "./userfiles/thumbs/Ruijie-RG-RAP2200(E).jpg",
    "Ruijie-RG-RAP2266.jpg": "./userfiles/thumbs/Ruijie-RG-RAP2266.jpg",
    "ruijie-logo.png": "./userfiles/thumbs/ruijie-logo.png",
    "server-icon.png": "./images/server-icon.png",
    "silicom-power-logo.png": "./userfiles/thumbs/silicom-power-logo.png",
    "software-icon.png": "./images/software-icon.png",
    "sunmi-logo.png": "./userfiles/thumbs/sunmi-logo.png",
    "synology-logo.png": "./userfiles/thumbs/synology-logo.png",
    "ThinkCentre-M70a-Gen6.jpg": "./userfiles/thumbs/ThinkCentre-M70a-Gen6.jpg",
    "ThinkPad-E14-Gen7-2.jpg": "./userfiles/thumbs/ThinkPad-E14-Gen7-2.jpg",
    "ThinkPad-T14s-Gen6.jpg": "./userfiles/thumbs/ThinkPad-T14s-Gen6.jpg",
    "Tower-400-G9.jpg": "./userfiles/thumbs/Tower-400-G9.jpg",
    "tp-link-1400px.jpg": "./userfiles/tp-link-1400px.jpg",
    "tp-link-logo.png": "./userfiles/thumbs/tp-link-logo.png",
    "TP-Link-Archer-AX23.jpg": "./userfiles/thumbs/TP-Link-Archer-AX23.jpg",
    "transcend-logo.png": "./userfiles/thumbs/transcend-logo.png",
    "trupower-logo.png": "./userfiles/thumbs/trupower-logo.png",
    "ubiquiti-logo.png": "./userfiles/thumbs/ubiquiti-logo.png",
    "uniview-logo.png": "./userfiles/thumbs/uniview-logo.png",
    "ups-icon.png": "./images/ups-icon.png",
    "vertiv-logo.png": "./userfiles/thumbs/vertiv-logo.png",
    "watashi-logo.png": "./userfiles/thumbs/watashi-logo.png",
    "wd-logo.png": "./userfiles/thumbs/wd-logo.png",
    "WL20.jpg": "./userfiles/thumbs/WL20.jpg",
    "ZKTeco_-MiniAC.jpg": "./userfiles/thumbs/ZKTeco%25E2%2580%258B-MiniAC.jpg",
    "ZKTeco-F18-ID.jpg": "./userfiles/thumbs/ZKTeco-F18-ID.jpg",
    "ZKTeco-F21.jpg": "./userfiles/thumbs/ZKTeco-F21.jpg",
    "zkteco-logo.png": "./userfiles/thumbs/zkteco-logo.png",
    "zkteco-sf200-0023.jpg": "./userfiles/thumbs/zkteco-sf200-0023.jpg",
    "zkteco-sf400.jpg": "./userfiles/thumbs/zkteco-sf400.jpg",
    "zycoo-logo.png": "./userfiles/thumbs/zycoo-logo.png",
    "Dell- Alienware-Core-i9-14900F-16GB-1.png":
      "./userfiles/thumbs/Dell- Alienware-Core-i9-14900F-16GB-1.png",
  };

  function resolveLocalAsset(url) {
    if (!url || url.indexOf("Leading IT Equipment") === -1) {
      return null;
    }

    var cleanUrl = url.replace(/&amp;/g, "&");
    var fileName = cleanUrl.split("/").pop();
    return localAssetMap[fileName] || null;
  }

  function createBrandFallback(label) {
    var fallback = document.createElement("div");
    fallback.className = "brand-fallback";
    fallback.innerHTML =
      '<i class="fa-solid fa-building"></i><span>' +
      (label || "Brand") +
      "</span>";
    return fallback;
  }

  function upgradeMissingBrandLogos(root) {
    root.querySelectorAll(".event_box img").forEach(function (img) {
      var source = img.getAttribute("src") || "";
      var unresolvedLegacyAsset = source.indexOf("Leading IT Equipment") !== -1;

      function replaceWithFallback() {
        if (!img.parentNode || img.dataset.fallbackApplied === "true") {
          return;
        }

        img.dataset.fallbackApplied = "true";
        img.replaceWith(createBrandFallback(img.getAttribute("alt")));
      }

      if (unresolvedLegacyAsset) {
        img.addEventListener("error", replaceWithFallback, { once: true });

        if (img.complete && (!img.naturalWidth || !img.naturalHeight)) {
          replaceWithFallback();
        }
      }
    });
  }

  function applyLocalAssetTargets(root) {
    root.querySelectorAll("[src], [href], [srcset]").forEach(function (node) {
      if (node.hasAttribute("src")) {
        var localSrc = resolveLocalAsset(node.getAttribute("src"));
        if (localSrc) {
          node.setAttribute("src", localSrc);
        }
      }

      if (node.hasAttribute("href")) {
        var localHref = resolveLocalAsset(node.getAttribute("href"));
        if (localHref) {
          node.setAttribute("href", localHref);
        }
      }

      if (node.hasAttribute("srcset")) {
        var srcset = node.getAttribute("srcset");
        var localSrcset = resolveLocalAsset(srcset);
        if (localSrcset) {
          node.setAttribute("srcset", localSrcset);
        }
      }
    });
  }

  function initLocalAssets() {
    applyLocalAssetTargets(document);
    upgradeMissingBrandLogos(document);
  }

  window.RootITAssets = {
    applyLocalAssetTargets: applyLocalAssetTargets,
    initLocalAssets: initLocalAssets,
    resolveLocalAsset: resolveLocalAsset,
  };

  document.addEventListener("DOMContentLoaded", initLocalAssets);
  document.addEventListener("partials:loaded", initLocalAssets);
})();
