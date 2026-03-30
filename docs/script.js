// AniRain Website - Vanilla JavaScript

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
const closeIcon = mobileMenuBtn.querySelector('.close-icon');

function toggleMobileMenu() {
  const isOpen = !mobileMenu.classList.contains('hidden');
  
  if (isOpen) {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  } else {
    mobileMenu.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  }
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
const mobileNavLinks = mobileMenu.querySelectorAll('a');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggleMobileMenu();
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Add staggered delay for feature cards
      if (entry.target.classList.contains('feature-card')) {
        const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.1}s`;
      }
    }
  });
}, observerOptions);

// Observe all elements with animate-on-scroll class
const animatedElements = document.querySelectorAll('.animate-on-scroll');
animatedElements.forEach(el => observer.observe(el));

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===== ANILIST API INTEGRATION =====
const ANILIST_POPULAR_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: [POPULARITY_DESC]) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        episodes
        averageScore
        format
        status
        seasonYear
        genres
      }
    }
  }
`;

async function fetchPopularAnime() {
  const loadingEl = document.getElementById('animeLoading');
  const rowsEl = document.getElementById('animeRows');
  const row1El = document.getElementById('animeRow1');
  const row2El = document.getElementById('animeRow2');

  try {
    // Fetch first page for first row
    const response1 = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_POPULAR_QUERY,
        variables: {
          page: 1,
          perPage: 20
        }
      })
    });

    // Fetch second page for second row
    const response2 = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_POPULAR_QUERY,
        variables: {
          page: 2,
          perPage: 20
        }
      })
    });

    const data1 = await response1.json();
    const data2 = await response2.json();

    if (data1.errors) {
      throw new Error(data1.errors[0].message);
    }

    if (data2.errors) {
      throw new Error(data2.errors[0].message);
    }

    const animeList1 = data1.data.Page.media;
    const animeList2 = data2.data.Page.media;

    // Render anime cards
    renderAnimeRow(animeList1, row1El);
    renderAnimeRow(animeList2, row2El);

    // Hide loading, show rows
    loadingEl.classList.add('hidden');
    rowsEl.classList.remove('hidden');

  } catch (error) {
    console.error('Error fetching anime:', error);
    loadingEl.innerHTML = '<p class="error-message">Failed to load anime. Please try again later.</p>';
  }
}

function renderAnimeRow(animeList, container) {
  // Duplicate the list for seamless infinite scroll
  const duplicatedList = [...animeList, ...animeList];
  
  container.innerHTML = duplicatedList.map((anime, index) => {
    const title = anime.title.english || anime.title.romaji;
    const episodes = anime.episodes ? `${anime.episodes} eps` : 'Ongoing';
    const rating = (anime.averageScore / 20).toFixed(1);
    const imageUrl = anime.coverImage.large || anime.coverImage.medium;
    
    return `
      <div class="anime-card" key="${anime.id}-${index}">
        <img src="${imageUrl}" alt="${title}" loading="lazy">
        <div class="anime-card-overlay"></div>
        <div class="anime-card-content">
          <h3 class="anime-card-title">${title}</h3>
          <div class="anime-card-info">
            <span>${episodes}</span>
            <div class="anime-card-rating">
              <span class="star-icon">★</span>
              <span>${rating}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Fetch anime on page load
document.addEventListener('DOMContentLoaded', fetchPopularAnime);

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== VIDEO MODAL =====
const watchDemoBtn = document.getElementById('watchDemoBtn');
const videoModal = document.getElementById('videoModal');
const videoModalBackdrop = document.getElementById('videoModalBackdrop');
const videoModalClose = document.getElementById('videoModalClose');
const videoContainer = document.querySelector('.video-container');

function openVideoModal() {
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  videoModal.classList.remove('active');
  document.body.style.overflow = '';
  // Pause video by removing and re-adding iframe
  const iframe = videoContainer.querySelector('iframe');
  if (iframe) {
    const src = iframe.src;
    iframe.src = '';
    setTimeout(() => {
      iframe.src = src;
    }, 100);
  }
}

watchDemoBtn.addEventListener('click', openVideoModal);
videoModalBackdrop.addEventListener('click', closeVideoModal);
videoModalClose.addEventListener('click', closeVideoModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal.classList.contains('active')) {
    closeVideoModal();
  }
});

