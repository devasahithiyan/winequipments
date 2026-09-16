document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navUl = document.querySelector('nav ul');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navUl.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  // Remove loader for each video or iframe when loaded
  const videoContainers = document.querySelectorAll('.video-container');
  videoContainers.forEach(container => {
    const loader = container.querySelector('.video-loader');
    const iframe = container.querySelector('iframe');
    const video = container.querySelector('video');

    if (iframe) {
      iframe.addEventListener('load', function() {
        if (loader) {
          loader.style.display = 'none';
        }
      });
    }
    if (video) {
      // Use 'loadeddata' event to know when video is ready
      video.addEventListener('loadeddata', function() {
        if (loader) {
          loader.style.display = 'none';
        }
      });
    }
  });

  // Additional interactive behavior for local videos
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.addEventListener('play', () => {
      console.log('Local installation video is now playing.');
    });
  });
});
