// ==========================================
// 1. KONFIGURACJA SUPABASE
// ==========================================
const SUPABASE_URL = "https://oxkstekhjumgbdjzxsdr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IU3Bb6fXNt6mZlJGx3JHjA_Ff_Otitd";

// Schemat z Table Editor:
// songs: id (uuid), artist_id (uuid -> artists), title (text), slug (text), lyrics (text)
// Jeśli w tabeli songs masz też kolumny np. views albo created_at, możesz je dodać poniżej.
const DB_CONFIG = {
    songsTable: "songs",
    artistsTable: "artists",
    colId: "id",
    colTitle: "title",
    colSlug: "slug",
    colArtistId: "artist_id",
    colArtistName: "name",      // zmień jeśli w tabeli artists nazwa wykonawcy nazywa się inaczej (np. title)
    colViews: null,             // np. "views" — zostaw null, jeśli jeszcze nie ma tej kolumny w songs
    colCreated: null            // np. "created_at" — zostaw null, jeśli jeszcze nie ma tej kolumny w songs
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
// 3. POMOCNICZE FUNKCJE DANYCH I RENDEROWANIA
// ==========================================
function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function getArtistName(row) {
    const rel = row[DB_CONFIG.artistsTable];
    if (Array.isArray(rel)) {
        return rel[0]?.[DB_CONFIG.colArtistName] || "Nieznany wykonawca";
    }
    if (rel && typeof rel === "object") {
        return rel[DB_CONFIG.colArtistName] || "Nieznany wykonawca";
    }
    return "Nieznany wykonawca";
}

function renderSongList(containerId, items, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `<li><a href="#"><span><span class="title">${escapeHtml(emptyMessage)}</span><span class="artist">—</span></span></a></li>`;
        return;
    }

    container.innerHTML = items.map(song => {
        const key = encodeURIComponent(song[DB_CONFIG.colSlug] || song[DB_CONFIG.colId] || "");
        const title = escapeHtml(song[DB_CONFIG.colTitle] || "Bez tytułu");
        const artist = escapeHtml(getArtistName(song));
        return `<li><a href="/utwor?id=${key}"><span><span class="title">${title}</span><span class="artist">${artist}</span></span></a></li>`;
    }).join("");
}

function buildSelectQuery() {
    const baseCols = [DB_CONFIG.colId, DB_CONFIG.colTitle, DB_CONFIG.colSlug, DB_CONFIG.colArtistId];
    if (DB_CONFIG.colViews) baseCols.push(DB_CONFIG.colViews);
    if (DB_CONFIG.colCreated) baseCols.push(DB_CONFIG.colCreated);
    return `${baseCols.join(", ")}, ${DB_CONFIG.artistsTable} (${DB_CONFIG.colArtistName})`;
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
        let popularQuery = supabaseClient
            .from(DB_CONFIG.songsTable)
            .select(buildSelectQuery())
            .limit(5);

        if (DB_CONFIG.colViews) {
            popularQuery = popularQuery.order(DB_CONFIG.colViews, { ascending: false });
        }

        const { data: popular, error: popErr } = await popularQuery;
        if (popErr) throw popErr;
        renderSongList("popularSongs", popular, "Brak utworów w bazie");

        let latestQuery = supabaseClient
            .from(DB_CONFIG.songsTable)
            .select(buildSelectQuery())
            .limit(5);

        if (DB_CONFIG.colCreated) {
            latestQuery = latestQuery.order(DB_CONFIG.colCreated, { ascending: false });
        }

        const { data: latest, error: latErr } = await latestQuery;
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
            .from(DB_CONFIG.songsTable)
            .select(buildSelectQuery())
            .ilike(DB_CONFIG.colTitle, `%${query}%`)
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
        const { data, error } = await supabaseClient
            .from(DB_CONFIG.songsTable)
            .select(buildSelectQuery())
            .limit(25);

        if (!error) {
            const filtered = (data || []).filter(row => {
                const name = getArtistName(row).trim();
                if (!name) return false;
                if (letter === "0-9") return /^[0-9]/.test(name);
                return name.toUpperCase().startsWith(letter.toUpperCase());
            });

            const firstHeading = document.querySelector("#teksty section:first-child h2");
            if (firstHeading) firstHeading.textContent = `Wykonawcy na literę: ${letter}`;
            renderSongList("popularSongs", filtered, `Brak wykonawców na ${letter}`);
            document.getElementById("teksty")?.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Start
loadHomepageSongs();
