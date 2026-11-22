/* Pasek z informacją o zgłaszaniu naruszeń.
   Wgraj obok style.css i dodaj do każdej strony, tuż przed </body>:
   <script src="powiadomienie.js"></script>
   Pasek pojawia się od razu po wejściu. Zamknięcie obowiązuje do końca wizyty
   (po ponownym wejściu na stronę pojawi się znowu). */
(function () {
    var KEY = "lyrio-notice-closed";
    try { if (sessionStorage.getItem(KEY) === "1") return; } catch (e) {}

    var css = document.createElement("style");
    css.textContent =
        ".lyrio-notice{position:sticky;top:0;z-index:1000;display:flex;align-items:flex-start;" +
        "gap:14px;padding:12px 20px;background:var(--text,#111);color:var(--bg,#fff);" +
        "font-size:14px;line-height:1.5}" +
        ".lyrio-notice p{flex:1;margin:0;max-width:900px}" +
        ".lyrio-notice a{color:inherit;text-decoration:underline;font-weight:600}" +
        ".lyrio-notice button{flex:none;border:1px solid currentColor;border-radius:4px;" +
        "background:transparent;color:inherit;font:inherit;font-size:13px;padding:5px 12px;cursor:pointer}" +
        ".lyrio-notice a:focus-visible,.lyrio-notice button:focus-visible{outline:2px solid currentColor;outline-offset:2px}";
    document.head.appendChild(css);

    var bar = document.createElement("div");
    bar.className = "lyrio-notice";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Informacja o prawach autorskich");

    var p = document.createElement("p");
    p.appendChild(document.createTextNode(
        "Teksty na tej stronie dodają użytkownicy. Jeśli jesteś właścicielem praw i uważasz, " +
        "że tekst narusza twoje prawa, "));
    var a = document.createElement("a");
    a.href = "naruszenia.html";
    a.textContent = "zgłoś naruszenie";
    p.appendChild(a);
    p.appendChild(document.createTextNode(". Sprawdzimy zgłoszenie i niezwłocznie usuniemy tekst, jeśli zgłoszenie jest zasadne."));

    var b = document.createElement("button");
    b.type = "button";
    b.textContent = "Rozumiem";
    b.addEventListener("click", function () {
        try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
        bar.remove();
    });

    bar.appendChild(p);
    bar.appendChild(b);
    document.body.insertBefore(bar, document.body.firstChild);
})();
