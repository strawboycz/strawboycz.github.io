document.addEventListener('DOMContentLoaded', () => {

    // Trick definition
    class Trick {
        constructor(url, delay, correctAnswer, categories) {
            this.url = url;
            this.delay = delay;
            this.correctAnswer = correctAnswer;
            this.categories = categories;
        }
    }

    // Guess definition
    class Guess {
        constructor(name, categories) {
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
        new Guess('Double frontflip', ['flip', 'double'])
    ];

    function getGuessByName(name) {
        return guesses.find(guess => guess.name.toLowerCase() === name.toLowerCase());
    }

    const trickList = document.getElementById('trick-list');
    guesses.forEach(guess => {
        trickList.innerHTML += '<option value="' + guess.name + '">';
    });

    // Videos declaration
    const videos = [
        new Trick('https://www.instagram.com/p/CeteK9xoLuX/', 3000, 'Kong precision', ['vault']),
    ];

    function getRandomTrick() {
        const randomIndex = Math.floor(Math.random() * videos.length);
        return videos[randomIndex];
    }

    const currentTrick = getRandomTrick();

    const videoContainer = document.getElementById('video-container');
    const showButton = document.getElementById('show-video');
    const trickIframe = document.getElementById('trick-iframe');

    showButton.addEventListener('click', () => {
        videoContainer.style.display = 'block'; // Show video container
        showButton.style.display = 'none'; // Hide the button after clicking
        
        // Set the Instagram URL in the iframe
        const postId = currentTrick.url.split('/')[4];
        trickIframe.src = `https://www.instagram.com/p/${postId}/embed/captioned/`;
    });

    const guessForm = document.getElementById('guess-form');
    const inputElement = document.getElementById('trick-input');
    const feedbackElement = document.getElementById('feedback');

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
        } 
        else {
            feedbackElement.innerHTML += `<br>❌ Wrong!`;
            /*let guess = getGuessByName(userGuess);
            let mutualCategories = guess.getMutualCategories(currentTrick);
            feedbackElement.innerHTML += '<br>The trick you are trying to guess is also in categories:';
            mutualCategories.forEach(category => {
                feedbackElement.innerHTML += '<br>' + category;
            });*/
        }
    });

});
