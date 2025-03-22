document.addEventListener('DOMContentLoaded', () => {

    // Class definitions
    class Trick {
        constructor(url, delay, correctAnswer, categories) {
            this.url = url;
            this.delay = delay;
            this.correctAnswer = correctAnswer;
            this.categories = categories;
        }
    }

    class Guess {
        constructor(name, categories) {
            this.name = name;
            this.categories = categories;
        }
        getMutualCategories(trick) {
            return this.categories.filter(category => trick.categories.includes(category));
        }
    }

    // Array definitions
    const guesses = [
        new Guess('Kong precision', ['vault']),
        new Guess('Dive roll', ['roll']),
        new Guess('Double frontflip', ['flip', 'double'])
    ];

    const videos = [
        new Trick('https://www.instagram.com/p/CeteK9xoLuX/', 3000, 'Kong precision', ['vault']),
        new Trick('https://www.instagram.com/reel/DGAxZuCpAuX/', 1800, 'Dive roll', ['roll']),
    ];

    // Filling <datalist>
    const trickList = document.getElementById('trick-list');
    guesses.forEach(guess => {
        trickList.innerHTML += '<option value="' + guess.name + '">';
    });

   
    function getRandomTrick() { // generates random trick
        const randomIndex = Math.floor(Math.random() * videos.length);
        //return videos[videos.length - 1];
        return videos[randomIndex];
    }
    const currentTrick = getRandomTrick();

    // I don't know how this works, bless chatGPT
    function loadInstagramEmbed(url) {
        const container = document.getElementById("video-container");
        container.innerHTML = `
        <strong><p>🎥 Doubleclick the video to start!</p></strong>
        <blockquote class="instagram-media"
            data-instgrm-permalink="${url}"
            data-instgrm-version="14"
            style="background:#FFF; border:0; margin: 1px; max-width:540px; width:100%;">
        </blockquote>`;
        if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
            window.instgrm.Embeds.process();
        }
    }

    // Play button behavior
    const videoContainer = document.getElementById('video-container');
    const showButton = document.getElementById('show-video');

    function hideVideoAfterDelay(delay) {
        setTimeout(() => {
            videoContainer.style.display = 'none';
        }, delay);
    }

    showButton.addEventListener('click', () => {
        videoContainer.style.display = 'block'; 
        showButton.style.display = 'none';
        loadInstagramEmbed(currentTrick.url);
        // Hiding video after delay
        const interval = setInterval(() => {
            const iframe = videoContainer.querySelector('iframe');
            if (iframe) {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                clearInterval(interval); // Stop checking
    
                // Create the overlay and append it to the container
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Transparent
                overlay.style.cursor = 'pointer'; // Indicate that it’s clickable
                videoContainer.appendChild(overlay);
    
                // Add the click event listener to the overlay
                overlay.addEventListener('click', () => {
                    hideVideoAfterDelay(currentTrick.delay);
                    videoContainer.removeChild(overlay); // Remove the overlay after click
                });
            }
        }, 100); // Check every 100ms until iframe is found
    });


    // Guessing form behavior
    const guessForm = document.getElementById('guess-form');
    const inputElement = document.getElementById('trick-input');
    const feedbackElement = document.getElementById('feedback');

   

    guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userGuess = inputElement.value.trim();
        if (userGuess.toLowerCase() === currentTrick.correctAnswer.toLowerCase()) {
            feedbackElement.innerHTML = '<br>Your guess: ' + userGuess + ' is ✅ Correct!';
            feedbackElement.style.color = 'green';
            videoContainer.style.display = 'block';
            const container = document.getElementById("video-container");
            container.innerHTML = `
            <strong><p>🏆 Good job, see the full clip!</p></strong>
            <blockquote class="instagram-media"
                data-instgrm-permalink="${currentTrick.url}"
                data-instgrm-version="14"
                style="background:#FFF; border:0; margin: 1px; max-width:540px; width:100%;">
            </blockquote>`;
            if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
                window.instgrm.Embeds.process();
            }

        } else {
            feedbackElement.innerHTML = '<br>Your guess: ' + userGuess + ' is ❌ Wrong!';
            feedbackElement.style.color = 'red';

        }
    });

});
