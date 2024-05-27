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


const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    changeProfilePictures();
  });
});

observer.observe(document.body, { childList: true, subtree: true });
