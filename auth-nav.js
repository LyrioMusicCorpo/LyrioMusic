(function () {
    const SUPABASE_URL = "https://oxkstekhjumgbdjzxsdr.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_IU3Bb6fXNt6mZlJGx3JHjA_Ff_Otitd";

    if (!window.supabase) return;

    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    });

    window.lyrioAuth = sb;

    function findLoginLinks() {
        const links = Array.from(document.querySelectorAll("a, button"));
        return links.filter((el) => {
            const href = (el.getAttribute("href") || "").toLowerCase();
            const text = (el.textContent || "").trim().toLowerCase();
            return href.includes("logowanie.html") || text === "zaloguj się" || text === "wyloguj się";
        });
    }

    function renderAuthControls(session) {
        const controls = findLoginLinks();
        const isLoggedIn = Boolean(session && session.user);

        controls.forEach((el) => {
            if (!el.dataset.origHref) {
                el.dataset.origHref = el.getAttribute("href") || "logowanie.html";
            }

            if (isLoggedIn) {
                el.textContent = "Wyloguj się";
                el.setAttribute("href", "#logout");
                el.dataset.authAction = "logout";
            } else {
                el.textContent = "Zaloguj się";
                el.setAttribute("href", el.dataset.origHref);
                el.dataset.authAction = "login";
            }
        });
    }

    document.addEventListener("click", async (e) => {
        const target = e.target.closest("[data-auth-action='logout']");
        if (!target) return;

        e.preventDefault();
        target.textContent = "Wylogowywanie...";
        await sb.auth.signOut();
        renderAuthControls(null);
        window.location.reload();
    });

    async function initAuthUI() {
        const { data } = await sb.auth.getSession();
        renderAuthControls(data.session);

        sb.auth.onAuthStateChange((_event, session) => {
            renderAuthControls(session);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAuthUI);
    } else {
        initAuthUI();
    }
})();
