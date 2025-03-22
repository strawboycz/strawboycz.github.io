document.addEventListener('DOMContentLoaded', () => {

    // Trick definiton
    class Trick {
        constructor(url,delay,correctAnswer, categories) {
            this.url = url;      
            this.delay = delay;    
            this.correctAnswer = correctAnswer; 
            this.categories = categories;  
        }
    }

    // Guess definition
    class Guess {
        constructor(name, categories){
            this.name = name;
            this.categories = categories;
        }
        getMutualCategories(trick) {
            return this.categories.filter(category => trick.categories.includes(category));
        }
    }

    // Guesses declaration
    const guesses = [
        new Guess('Kong precision', ['vault']),
        new Guess('Dive roll', ['roll']),
        new Guess('Double frontflip', ['flip','double'])
    ];

    function getGuessByName(name) {
        return guesses.find(guess => guess.name.toLowerCase() === name.toLowerCase());
    }

    const trickList = document.getElementById('trick-list');
    guesses.forEach(guess => {
        trickList.innerHTML += '<option value="' + guess.name + '">';
    });

    // videos declaration
    const videos = [
        new Trick('https://www.instagram.com/p/CeteK9xoLuX/',3000,'Kong precision', ['vault']),
    ];

    function getRandomTrick() { //generates random video
        const randomIndex = Math.floor(Math.random() * videos.length);
        return videos[randomIndex];
    }

    const currentTrick = getRandomTrick();

    const videoContainer = document.getElementById('video-container');
    const showButton = document.getElementById('show-video');
    
    function loadInstagramEmbed() {
        if (typeof window.instgrm === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.onload = () => window.instgrm.Embeds.process();
            document.body.appendChild(script);
        } else {
            window.instgrm.Embeds.process();
        }
    }

    showButton.addEventListener('click', () => {
        videoContainer.innerHTML = `
            <p>🎥 Press "Play" to start!</p>
            <blockquote class="instagram-media" data-instgrm-permalink="${currentTrick.url}" data-instgrm-version="14"></blockquote>
        `;
        loadInstagramEmbed(); // Načte embed skript, pokud není
        showButton.style.display = 'none';
    });

    const guessForm = document.getElementById('guess-form');
    const inputElement = document.getElementById('trick-input');
    const feedbackElement = document.getElementById('feedback');
    
    function hideVideoAfterDelay(delay) {
        setTimeout(() => {
            videoContainer.style.display = 'none';
        }, delay);
    }
    
    /*showButton.addEventListener('click', () => {
        videoContainer.style.display = 'block';
        showButton.style.display = 'none';
    
        const checkFocus = setInterval(() => {
            if (document.activeElement === igVideo) {
                clearInterval(checkFocus); 
                hideVideoAfterDelay(currentTrick.delay); 
            }
        }, 100);
    });*/

    guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userGuess = inputElement.value.trim();

        if (userGuess.toLowerCase() === currentTrick.correctAnswer.toLowerCase()) {
            feedbackElement.innerHTML += '<br>✅ Correct!';
            igVideo.src = currentTrick.url;
        } 
        else {
            feedbackElement.innerHTML += `<br>❌ Wrong!`;
            /*let guess = getGuessByName(userGuess);
            let mutualCategories = guess.getMutualCategories(currentTrick);
            feedbackElement.innerHTML += '<br>The trick you are trying to guess is also in categories:';
            mutualCategories.forEach(category => {
                feedbackElement.innerHTML += '<br>' + category.name;
            });*/
        }
    });


});