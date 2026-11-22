/* Jedno miejsce na dane administratora. */
window.LYRIO = {
    operatorName: "Korneliusz Dudek",                 // będzie publiczne w regulaminie
    contactEmail: "KontaktLyrioMusic@proton.me",      // adres do kontaktu i zgłoszeń naruszeń (będzie publiczny)
    siteUrl: "https://lyriomusiccorpo.github.io/LyrioMusic/",
    updated: "22 listopada 2026"
};

document.addEventListener("DOMContentLoaded", function () {
    var c = window.LYRIO || {};
    var missing = !c.operatorName || !c.contactEmail;
    var used = false;

    function fill(selector, value, placeholder, isMail) {
        document.querySelectorAll(selector).forEach(function (el) {
            used = true;
            el.textContent = value || placeholder;
            if (isMail && value && el.tagName === "A") {
                el.href = "mailto:" + value;
            }
        });
    }

    fill("[data-op]", c.operatorName, "[UZUPEŁNIJ: administrator]");
    fill("[data-email]", c.contactEmail, "[UZUPEŁNIJ: e-mail]", true);
    fill("[data-site]", c.siteUrl, "[UZUPEŁNIJ: adres strony]");
    fill("[data-updated]", c.updated, "[UZUPEŁNIJ: data]");

    // Ostrzeżenie dla administratora, tylko gdy brakuje danych.
    if (missing && used) {
        var box = document.createElement("div");
        box.setAttribute("role", "alert");
        box.style.cssText =
            "margin:16px auto;max-width:1100px;padding:14px 18px;border:1px solid #c0392b;" +
            "border-radius:6px;background:rgba(192,57,43,.12);color:inherit;font-size:14px;line-height:1.5";
        box.textContent =
            "Uwaga dla administratora: uzupełnij operatorName i contactEmail w pliku site-config.js. " +
            "Dopóki tego nie zrobisz, ta strona nie jest gotowa do publikacji.";
        var anchor = document.querySelector("main") || document.body;
        anchor.insertBefore(box, anchor.firstChild);
    }
});
