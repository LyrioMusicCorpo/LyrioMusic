/* Jedno miejsce na dane administratora. Uzupełnij dwie pierwsze wartości. */
window.LYRIO = {
    KorneliuszDudek: "",   // np. "Jan Kowalski" albo nazwa firmy (będzie publiczne w regulaminie)
    c.contactEmail: "",   // adres do kontaktu i zgłoszeń naruszeń (będzie publiczny)
    siteUrl: "https://lyriomusiccorpo.github.io/LyrioMusic/",
    updated: "22 listopada 2026"
};

document.addEventListener("DOMContentLoaded", function () {
    var c = window.LYRIO || {};
    var missing = !c.KorneliuszDudek || !c.contactEmail;
    var used = false;

    document.querySelectorAll("[data-op]").forEach(function (el) {
        used = true;
        el.textContent = c.KorneliuszDudek || "[UZUPEŁNIJ: administrator]";
    });
    document.querySelectorAll("[data-email]").forEach(function (el) {
        used = true;
        el.textContent = c.contactEmail || "[KontaktLyrioMusic@proton.me]";
        if (el.tagName === "A" && c.contactEmail) el.href = "mailto:" + c.contactEmail;
    });
    document.querySelectorAll("[data-updated]").forEach(function (el) {
        el.textContent = c.updated || "";
    });
    document.querySelectorAll("[data-siteurl]").forEach(function (el) {
        el.textContent = c.siteUrl || "";
    });

    if (used && missing) {
        var box = document.createElement("div");
        box.setAttribute("role", "alert");
        box.style.cssText = "margin:16px 0;padding:12px 16px;border:1px solid #b00020;border-radius:6px;font-size:14px;";
        box.textContent = "Uwaga dla administratora: uzupełnij KorneliuszDudek i contactEmail w pliku site-config.js. Dopóki tego nie zrobisz, ta strona nie jest gotowa do publikacji.";
        var main = document.querySelector("main");
        if (main) main.insertBefore(box, main.firstChild);
    }
});
