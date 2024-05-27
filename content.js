const newProfileImageUrl = 'https://example.com/path/to/your/image.jpg';

function changeProfilePictures() {
  const profilePictures = document.querySelectorAll('img');
  profilePictures.forEach(img => {
    if (img.alt.includes('profile') || img.src.includes('profile')) {
      img.src = newProfileImageUrl;
    }
  });
}

// Run the function initially
changeProfilePictures();

// Observe the feed for changes and apply the profile picture change when new posts are loaded
const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    changeProfilePictures();
  });
});

observer.observe(document.body, { childList: true, subtree: true });
