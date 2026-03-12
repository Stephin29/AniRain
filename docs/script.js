const videoOptions = ['1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4'];

// Set launch date
const targetDate = new Date("March 26, 2026 20:59:59").getTime();

function setRandomVideo() {
    const video = document.getElementById('bg-video');
    const randomIndex = Math.floor(Math.random() * videoOptions.length);
    
    // Simple fade transition effect could be added here via CSS classes
    video.src = videoOptions[randomIndex];
    video.load();
}
setRandomVideo()
setInterval(setRandomVideo, 30000); 

function updateCountdown() {

    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "LAUNCHED";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60)) /
        1000
    );

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

// update every second
setInterval(updateCountdown, 1000);


// run once immediately
updateCountdown();