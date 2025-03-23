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
        new Guess('Double frontflip', ['flip', 'double']),
        new Guess('Sideflip', []),
        new Guess('Running gainer', []),
        new Guess('Kong gainer', []),
        new Guess('Running precision 360', []),
        new Guess('Running precision', []),
        new Guess('Dive kong', []),
        new Guess('Reverse precision', []),
        new Guess('Dash precision', []),
        new Guess('Double kong', []),
        new Guess('Dive frontflip', []),

    ];

    const videos = [
        new Trick('https://www.instagram.com/p/CeteK9xoLuX/', 3000, 'Kong precision', ['vault']),
        new Trick('https://www.instagram.com/reel/DGAxZuCpAuX/', 1800, 'Dive roll', ['roll']),
        new Trick('https://www.instagram.com/reel/C5I8N9YNJms/', 2800, 'Double frontflip', []),
        new Trick('https://www.instagram.com/reel/DCpFvd9Nygp/', 1900, 'Sideflip', []),
        new Trick('https://www.instagram.com/reel/DAgReI6NIm_/', 2300, 'Running gainer', []),
        new Trick('https://www.instagram.com/reel/DHeHtcltpZC/', 2600, 'Kong gainer', []),
        new Trick('https://www.instagram.com/p/CFC84DKn-cd/', 6000, 'Running precision 360', []),
        new Trick('https://www.instagram.com/reel/C_Dw_jgMh9W/', 2100, 'Sideflip', []),
        new Trick('https://www.instagram.com/reel/DF5iCTEstm-/', 3000, 'Running precision', []),
        new Trick('https://www.instagram.com/reel/DCE6d0-NuTQ/', 1300, 'Running precision 360', []),
        new Trick('https://www.instagram.com/reel/C5LXS66t_Pq/', 5600, 'Dive kong', []),
        new Trick('https://www.instagram.com/reel/DEAoXLQTA7c/', 2000, 'Kong precision', []),
        new Trick('https://www.instagram.com/reel/DGifuhLt7r5/', 3700, 'Dive kong', []),
        new Trick('https://www.instagram.com/p/Ceb03iet0hq/', 4000, 'Kong precision', []),
        new Trick('https://www.instagram.com/reel/C4F5AoXPzUW/', 2300, 'Reverse precision', []),
        new Trick('https://www.instagram.com/p/C2IJ9JSNERR/', 3300, 'Reverse precision', []),
        new Trick('https://www.instagram.com/reel/DHErqnPtA7L/', 2600, 'Double kong', []),
        new Trick('https://www.instagram.com/reel/Csix1eEpWG9/', 2700, 'Running precision', []),
        new Trick('https://www.instagram.com/reel/C7uQALSNgr9/', 3200, 'Dive frontflip', []),

        
    ];

    // Filling <datalist>
    const trickList = document.getElementById('trick-list');
    guesses.sort((a,b) => a.name.localeCompare(b.name));
    guesses.forEach(guess => {
        trickList.innerHTML += '<option value="' + guess.name + '">';
    });

   
    function getRandomTrick() { // generates random trick
        const randomIndex = Math.floor(Math.random() * videos.length);
        //return videos[videos.length - 1]; //for testing
        return videos[randomIndex];
    }
    const currentTrick = getRandomTrick();

    // I don't know how this works, bless chatGPT
    function loadInstagramEmbed(url, msg) {
        guessForm.style.display = "none";
        const container = document.getElementById("video-container");
        container.innerHTML = `
        <strong><p>${msg}</p></strong>
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
    const guessForm = document.getElementById('guess-form');

    function hideVideoAfterDelay(delay) {
        setTimeout(() => {
            videoContainer.style.display = 'none';
            videoContainer.innerHTML = "";
            guessForm.style.display = "block";
        }, delay);
    }

    function startRound(url, msg) {
        let userInput = guessForm.querySelector('#trick-input');
        userInput.value = "";
        videoContainer.innerHTML = "";
        videoContainer.style.display = 'block'; 
        showButton.style.display = 'none';
        loadInstagramEmbed(url,msg);
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
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                overlay.style.cursor = 'pointer';
                videoContainer.style.position = 'relative';
                videoContainer.appendChild(overlay);
    
                // Add the click event listener to the overlay
                overlay.addEventListener('click', () => {
                    hideVideoAfterDelay(currentTrick.delay);
                    videoContainer.removeChild(overlay); // Remove the overlay after click
                });
            }
        }, 100);
    }

    showButton.addEventListener('click', () => {
        startRound(currentTrick.url, '🎥 Doubleclick the video to start!');
    });


    // Guessing form behavior
    const inputElement = document.getElementById('trick-input');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('next-round');
    
   

    guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userGuess = inputElement.value.trim();
        if (userGuess.toLowerCase() === currentTrick.correctAnswer.toLowerCase()) {
            feedbackElement.innerHTML = '<br>Your guess: ' + userGuess + ' is ✅ Correct!';
            feedbackElement.style.color = 'green';
            videoContainer.style.display = 'block';
            loadInstagramEmbed(currentTrick.url,'🏆 Good job, see the full clip!');
            nextButton.style.display = 'block';
        } else {
            feedbackElement.innerHTML = '<br>Your guess: ' + userGuess + ' is ❌ Wrong!';
            feedbackElement.style.color = 'red';
            videoContainer.style.display = 'block';
            startRound(currentTrick.url, '🎥 So close, doubleclick the video to try again!');
        }
    });

    nextButton.addEventListener('click', () => {
        location.reload();
    });
});
