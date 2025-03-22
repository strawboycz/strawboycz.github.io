document.addEventListener('DOMContentLoaded', () => {

    // Definice třídy pro trik
    class Trick {
        constructor(url, delay, correctAnswer, categories) {
            this.url = url;
            this.delay = delay;
            this.correctAnswer = correctAnswer;
            this.categories = categories;
        }
    }

    // Definice třídy pro odhad
    class Guess {
        constructor(name, categories) {
            this.name = name;
            this.categories = categories;
        }
        getMutualCategories(trick) {
            return this.categories.filter(category => trick.categories.includes(category));
        }
    }

    // Deklarace odhadů
    const guesses = [
        new Guess('Kong precision', ['vault']),
        new Guess('Dive roll', ['roll']),
        new Guess('Double frontflip', ['flip', 'double'])
    ];

    // Naplnění datalistu pro input
    const trickList = document.getElementById('trick-list');
    guesses.forEach(guess => {
        trickList.innerHTML += '<option value="' + guess.name + '">';
    });

    // Deklarace videí/triků
    const videos = [
        new Trick('https://www.instagram.com/p/CeteK9xoLuX/', 3000, 'Kong precision', ['vault']),
        // Přidejte další triky dle potřeby...
    ];

    // Náhodný výběr triku
    function getRandomTrick() {
        const randomIndex = Math.floor(Math.random() * videos.length);
        return videos[randomIndex];
    }
    const currentTrick = getRandomTrick();

    // Funkce pro dynamické načtení Instagram embed kódu
    function loadInstagramEmbed(url) {
        const container = document.getElementById("video-container");
        container.innerHTML = `<blockquote class="instagram-media"
            data-instgrm-permalink="${url}"
            data-instgrm-version="14"
            style="background:#FFF; border:0; margin: 1px; max-width:540px; width:100%;">
        </blockquote>`;
        // Pokud je skript již načten, zavoláme jeho metodu pro zpracování nového obsahu
        if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
            window.instgrm.Embeds.process();
        }
    }

    // Obsluha tlačítka pro zobrazení videa
    const videoContainer = document.getElementById('video-container');
    const showButton = document.getElementById('show-video');

    showButton.addEventListener('click', () => {
        videoContainer.style.display = 'block';  // Zobrazit kontejner
        showButton.style.display = 'none';         // Skrýt tlačítko
        loadInstagramEmbed(currentTrick.url);
    });

    const iframe = videoContainer.querySelector('iframe');
    
    if (iframe) {
        iframe.addEventListener('click', () => {
            console.log('Kliknuto na Instagram video.');
            hideVideoAfterDelay(currentTrick.delay); // Skrytí videa po kliknutí
        });
    }

    // Obsluha formuláře pro odhad triku
    const guessForm = document.getElementById('guess-form');
    const inputElement = document.getElementById('trick-input');
    const feedbackElement = document.getElementById('feedback');

    // Po určité době video zmizí
    function hideVideoAfterDelay(delay) {
        setTimeout(() => {
            videoContainer.style.display = 'none';
        }, delay);
    }

    guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userGuess = inputElement.value.trim();
        if (userGuess.toLowerCase() === currentTrick.correctAnswer.toLowerCase()) {
            feedbackElement.innerHTML += '<br>✅ Correct!';
            hideVideoAfterDelay(currentTrick.delay);
        } else {
            feedbackElement.innerHTML += `<br>❌ Wrong!`;
        }
    });

});
