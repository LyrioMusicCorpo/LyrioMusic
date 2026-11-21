// ==========================================
// 1. KONFIGURACJA SUPABASE
// ==========================================
const SUPABASE_URL = "https://oxkstekhjumgbdjzxsdr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IU3Bb6fXNt6mZlJGx3JHjA_Ff_Otitd";

// Nazwy tabeli i kolumn w bazie (dostosuj, jeśli u Ciebie nazywają się inaczej)
const DB_CONFIG = {
    table: "songs",
    colId: "id",
    colTitle: "title",
    colArtist: "artist",
    colViews: "views",
    colCreated: "created_at"
};

let supabaseClient = null;
if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ==========================================
// 2. OBSŁUGA MOTYWU (LIGHT / DARK)
// ==========================================
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute("aria-pressed", theme === "dark");
}

applyTheme(root.dataset.theme || "light");

toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("lyrio-theme", next); } catch (e) {}
});

// ==========================================
// 3. RENDEROWANIE LISTY UTWORÓW
// ==========================================
function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function renderSongList(containerId, items, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `<li><a href="#"><span><span class="title">${escapeHtml(emptyMessage)}</span><span class="artist">—</span></span></a></li>`;
        return;
    }

    container.innerHTML = items.map(song => {
        const id = encodeURIComponent(song[DB_CONFIG.colId] ?? "");
        const title = escapeHtml(song[DB_CONFIG.colTitle] || "Bez tytułu");
        const artist = escapeHtml(song[DB_CONFIG.colArtist] || "Nieznany wykonawca");
        return `<li><a href="/utwor?id=${id}"><span><span class="title">${title}</span><span class="artist">${artist}</span></span></a></li>`;
    }).join("");
}

// ==========================================
// 4. POBIERANIE DANYCH Z SUPABASE
// ==========================================
async function loadHomepageSongs() {
    if (!supabaseClient) {
        renderSongList("popularSongs", [], "Brak klienta Supabase");
        renderSongList("latestSongs", [], "Brak klienta Supabase");
        return;
    }

    try {
        // Popularne teksty (sortowane po wyświetleniach)
        const { data: popular, error: popErr } = await supabaseClient
            .from(DB_CONFIG.table)
            .select(`${DB_CONFIG.colId}, ${DB_CONFIG.colTitle}, ${DB_CONFIG.colArtist}`)
            .order(DB_CONFIG.colViews, { ascending: false })
            .limit(5);

        if (popErr) throw popErr;
        renderSongList("popularSongs", popular, "Brak utworów w bazie");

        // Najnowsze teksty (sortowane po dacie dodania)
        const { data: latest, error: latErr } = await supabaseClient
            .from(DB_CONFIG.table)
            .select(`${DB_CONFIG.colId}, ${DB_CONFIG.colTitle}, ${DB_CONFIG.colArtist}`)
            .order(DB_CONFIG.colCreated, { ascending: false })
            .limit(5);

        if (latErr) throw latErr;
        renderSongList("latestSongs", latest, "Brak utworów w bazie");

    } catch (err) {
        console.error("Błąd Supabase:", err.message);
        renderSongList("popularSongs", [], "Błąd połączenia z bazą");
        renderSongList("latestSongs", [], "Błąd połączenia z bazą");
    }
}

// ==========================================
// 5. WYSZUKIWARKA I FILTR A-Z
// ==========================================
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("q");

if (searchForm && searchInput) {
    searchForm.addEventListener("submit", async (e) => {
        if (!supabaseClient) return;
        e.preventDefault();

        const query = searchInput.value.trim();
        if (!query) {
            loadHomepageSongs();
            return;
        }

        const { data, error } = await supabaseClient
            .from(DB_CONFIG.table)
            .select(`${DB_CONFIG.colId}, ${DB_CONFIG.colTitle}, ${DB_CONFIG.colArtist}`)
            .or(`${DB_CONFIG.colTitle}.ilike.%${query}%,${DB_CONFIG.colArtist}.ilike.%${query}%`)
            .limit(10);

        if (!error) {
            const firstHeading = document.querySelector("#teksty section:first-child h2");
            if (firstHeading) firstHeading.textContent = `Wyniki dla: „${query}”`;
            renderSongList("popularSongs", data, "Brak wyników wyszukiwania");
        }
    });
}

document.querySelectorAll("#alphabetNav a").forEach(link => {
    link.addEventListener("click", async (e) => {
        if (!supabaseClient) return;
        e.preventDefault();

        const letter = link.dataset.letter;
        let queryBuilder = supabaseClient
            .from(DB_CONFIG.table)
            .select(`${DB_CONFIG.colId}, ${DB_CONFIG.colTitle}, ${DB_CONFIG.colArtist}`);

        if (letter === "0-9") {
            queryBuilder = queryBuilder.filter(DB_CONFIG.colArtist, "imatch", "^[0-9]");
        } else {
            queryBuilder = queryBuilder.ilike(DB_CONFIG.colArtist, `${letter}%`);
        }

        const { data, error } = await queryBuilder.limit(10);
        if (!error) {
            const firstHeading = document.querySelector("#teksty section:first-child h2");
            if (firstHeading) firstHeading.textContent = `Wykonawcy na literę: ${letter}`;
            renderSongList("popularSongs", data, `Brak wykonawców na ${letter}`);
            document.getElementById("teksty")?.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Start
loadHomepageSongs();
