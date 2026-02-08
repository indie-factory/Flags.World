// i18n 번역 사전
const i18n = {
    ko: {
        title: '🌍 세계 국기 검색',
        placeholder: '국가명 또는 수도명으로 검색...',
        loading: '로딩 중...',
        loadingCount: '전체 국가를 불러오는 중...',
        error: '데이터를 불러오는데 실패했습니다.',
        noResults: '검색 결과가 없습니다.',
        totalCount: (total) => `전체 ${total}개 국가`,
        searchCount: (current, total) => `${current}개 국가 검색됨 (전체 ${total}개)`,
        noCapital: '수도 정보 없음',
        translationKey: 'kor'
    },
    en: {
        title: '🌍 World Flags Search',
        placeholder: 'Search by country or capital...',
        loading: 'Loading...',
        loadingCount: 'Loading countries...',
        error: 'Failed to load data.',
        noResults: 'No results found.',
        totalCount: (total) => `${total} countries`,
        searchCount: (current, total) => `${current} countries found (${total} total)`,
        noCapital: 'No capital info',
        translationKey: null
    },
    ja: {
        title: '🌍 世界の国旗検索',
        placeholder: '国名または首都名で検索...',
        loading: '読み込み中...',
        loadingCount: '国データを読み込み中...',
        error: 'データの読み込みに失敗しました。',
        noResults: '検索結果がありません。',
        totalCount: (total) => `全${total}ヶ国`,
        searchCount: (current, total) => `${current}ヶ国が見つかりました（全${total}ヶ国）`,
        noCapital: '首都情報なし',
        translationKey: 'jpn'
    },
    zh: {
        title: '🌍 世界国旗搜索',
        placeholder: '按国家名或首都搜索...',
        loading: '加载中...',
        loadingCount: '正在加载国家数据...',
        error: '数据加载失败。',
        noResults: '没有搜索结果。',
        totalCount: (total) => `共 ${total} 个国家`,
        searchCount: (current, total) => `找到 ${current} 个国家（共 ${total} 个）`,
        noCapital: '无首都信息',
        translationKey: 'zho'
    },
    es: {
        title: '🌍 Buscador de Banderas',
        placeholder: 'Buscar por país o capital...',
        loading: 'Cargando...',
        loadingCount: 'Cargando países...',
        error: 'Error al cargar los datos.',
        noResults: 'No se encontraron resultados.',
        totalCount: (total) => `${total} países`,
        searchCount: (current, total) => `${current} países encontrados (${total} en total)`,
        noCapital: 'Sin información de capital',
        translationKey: 'spa'
    },
    fr: {
        title: '🌍 Recherche de Drapeaux',
        placeholder: 'Rechercher par pays ou capitale...',
        loading: 'Chargement...',
        loadingCount: 'Chargement des pays...',
        error: 'Échec du chargement des données.',
        noResults: 'Aucun résultat trouvé.',
        totalCount: (total) => `${total} pays`,
        searchCount: (current, total) => `${current} pays trouvés (${total} au total)`,
        noCapital: 'Pas d\'information sur la capitale',
        translationKey: 'fra'
    }
};

const supportedLangs = ['ko', 'en', 'ja', 'zh', 'es', 'fr'];

// 브라우저 언어 자동 감지
function detectLanguage() {
    const browserLang = navigator.language?.slice(0, 2);
    return supportedLangs.includes(browserLang) ? browserLang : 'en';
}

// 전역 변수
let allCountries = [];
let filteredCountries = [];
let currentLang = detectLanguage();

// DOM 요소
const searchInput = document.getElementById('searchInput');
const flagGrid = document.getElementById('flagGrid');
const countText = document.getElementById('countText');
const pageTitle = document.getElementById('pageTitle');
const langSwitcher = document.getElementById('langSwitcher');

// 언어 전환
function setLanguage(lang) {
    currentLang = lang;
    const t = i18n[lang];

    // html lang 속성
    document.documentElement.lang = lang;
    // 페이지 타이틀
    document.title = t.title.replace('🌍 ', '');
    pageTitle.textContent = t.title;
    // 검색 placeholder
    searchInput.placeholder = t.placeholder;

    // 활성 버튼 토글
    langSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 국가 목록이 로드되어 있으면 재정렬 및 렌더링
    if (allCountries.length > 0) {
        allCountries.sort((a, b) => a.names[currentLang].localeCompare(b.names[currentLang]));
        searchCountries(searchInput.value);
    }
}

// 국가 데이터 로드
async function loadCountries() {
    const t = i18n[currentLang];
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,cca2,translations');
        const data = await response.json();

        allCountries = data.map(country => ({
            names: {
                ko: country.translations?.kor?.common || country.name.common,
                en: country.name.common,
                ja: country.translations?.jpn?.common || country.name.common,
                zh: country.translations?.zho?.common || country.name.common,
                es: country.translations?.spa?.common || country.name.common,
                fr: country.translations?.fra?.common || country.name.common,
            },
            capital: country.capital?.[0] || '',
            flag: country.flags.svg || country.flags.png,
            cca2: country.cca2
        }));

        allCountries.sort((a, b) => a.names[currentLang].localeCompare(b.names[currentLang]));

        filteredCountries = [...allCountries];
        renderFlags();
        updateCount();

    } catch (error) {
        console.error('Country data load failed:', error);
        flagGrid.innerHTML = `<div class="loading">${t.error}</div>`;
    }
}

// 국기 카드 렌더링
function renderFlags() {
    const t = i18n[currentLang];

    if (filteredCountries.length === 0) {
        flagGrid.innerHTML = `<div class="no-results">${t.noResults}</div>`;
        return;
    }

    flagGrid.innerHTML = filteredCountries.map(country => {
        const primaryName = country.names[currentLang];
        const secondaryName = currentLang === 'en' ? country.names.ko : country.names.en;
        const capitalText = country.capital || t.noCapital;

        return `
        <div class="flag-card">
            <img
                src="${country.flag}"
                alt="${primaryName}"
                class="flag-image"
                loading="lazy"
            >
            <div class="flag-info">
                <div class="country-name">${primaryName}</div>
                <div class="country-name-en">${secondaryName}</div>
                <div class="capital">${capitalText}</div>
            </div>
        </div>`;
    }).join('');
}

// 검색 기능
function searchCountries(query) {
    const searchTerm = query.toLowerCase().trim();

    if (searchTerm === '') {
        filteredCountries = [...allCountries];
    } else {
        filteredCountries = allCountries.filter(country =>
            country.names[currentLang].toLowerCase().includes(searchTerm) ||
            country.names.en.toLowerCase().includes(searchTerm) ||
            country.capital.toLowerCase().includes(searchTerm)
        );
    }

    renderFlags();
    updateCount();
}

// 결과 개수 업데이트
function updateCount() {
    const t = i18n[currentLang];
    const total = allCountries.length;
    const current = filteredCountries.length;

    if (searchInput.value.trim() === '') {
        countText.textContent = t.totalCount(total);
    } else {
        countText.textContent = t.searchCount(current, total);
    }
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 이벤트 리스너
searchInput.addEventListener('input', debounce((e) => {
    searchCountries(e.target.value);
}, 300));

// 언어 선택 버튼 이벤트
langSwitcher.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn) {
        setLanguage(btn.dataset.lang);
    }
});

// 초기화
setLanguage(currentLang);
loadCountries();
