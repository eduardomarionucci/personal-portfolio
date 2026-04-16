let currentLanguage = 'pt_BR';

async function load(language) {
    const response = await fetch(`i18n/${language}.json`);
    const translations = await response.json();

    document.querySelectorAll('[data-i18n]').forEach(element => {

        const key = element.getAttribute('data-i18n');
        const value = access(translations, key);

        if (value !== undefined) {
            element.textContent = value;
        }

    });

    currentLanguage = language;
    localStorage.setItem('language', language);

    document.getElementById('current-lang').textContent = language.toUpperCase();
    document.documentElement.lang = language;
}

function toggleDropdown() {
    const menu = document.getElementById('lang-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

function selectLanguage(lang) {
    load(lang);
    toggleDropdown();
}

function access(obj, path) {
    return path.split('.').reduce((acc, part) => {
        if (acc === undefined || acc === null) return undefined;

        if (!isNaN(part)) {
            return acc[Number(part)];
        }

        return acc[part];
    }, obj);
}

async function getCounter() {
    try {
        const response = await fetch('https://api.github.com/users/eduardomarionucci');
        const counter = await response.json().public_repos;

        document.getElementById('repo-count').textContent = counter;
    } catch (e) {
        document.getElementById('repo-count').textContent = '—';
    }
}

document.addEventListener('DOMContentLoaded', getCounter);

document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.language-dropdown');
    if (!dropdown.contains(e.target)) {
        document.getElementById('lang-menu').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('language');

    if (saved) {
        load(saved);
    } else {
        const userLanguage = navigator.language.startsWith('pt_BR') ? 'pt_BR' : 'en_US';
        load(userLanguage);
    }
});

document.addEventListener('click', (e) => {
    const menu = document.getElementById('nav-menu');
    const button = document.querySelector('.menu-toggle');

    if (!menu.contains(e.target) && !button.contains(e.target)) {
        menu.classList.remove('active');
    }
});