/* ==========================================================================
   QPG ARCADE - REAL-TIME FILTER & SEARCH ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Select DOM Elements
  const searchInput = document.getElementById('search');
  const filterButtons = document.querySelectorAll('#filters .pill');
  const gameCards = document.querySelectorAll('#games .card');
  const resultsCount = document.getElementById('results-count');
  const totalCountBadge = document.querySelector('[data-cat="all"] .count');

  let activeCategory = 'all';
  let searchQuery = '';

  // 2. Initialize Category Counter Badges
  function initializeCounters() {
    // Set total count
    if (totalCountBadge) totalCountBadge.textContent = ` (${gameCards.length})`;
    
    // Count individual categories
    filterButtons.forEach(button => {
      const cat = button.getAttribute('data-cat');
      if (cat !== 'all') {
        const count = Array.from(gameCards).filter(card => card.getAttribute('data-cat') === cat).length;
        const countSpan = button.querySelector('.count');
        if (countSpan) countSpan.textContent = ` (${count})`;
      }
    });
  }

  // 3. Main Filter & Core Search Logic
  function filterGames() {
    let visibleCount = 0;

    gameCards.forEach(card => {
      const cardCategory = card.getAttribute('data-cat');
      const searchMetadata = card.getAttribute('data-search').toLowerCase();
      const cardTitle = card.querySelector('h2').textContent.toLowerCase();
      const cardDesc = card.querySelector('p').textContent.toLowerCase();

      // Check category match
      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
      
      // Check text search match (scans title, description, and hidden data-search keywords)
      const matchesSearch = cardTitle.includes(searchQuery) || 
                            cardDesc.includes(searchQuery) || 
                            searchMetadata.includes(searchQuery);

      // Toggle visibility based on matching both conditions
      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update real-time results text status
    updateResultsText(visibleCount);
  }

  // 4. Update UI Status Text
  function updateResultsText(count) {
    if (!resultsCount) return;
    
    if (searchQuery === '' && activeCategory === 'all') {
      resultsCount.textContent = ''; // Hide feedback text if no filters are active
    } else {
      resultsCount.textContent = `Showing ${count} of ${gameCards.length} games`;
    }
  }

  // 5. Setup Input Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterGames();
    });
  }

  // 6. Setup Filter Button Click Listeners
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from previous active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active state to clicked button
      button.classList.add('active');
      
      // Run filter engine
      activeCategory = button.getAttribute('data-cat');
      filterGames();
    });
  });

  // Run initialization setup
  initializeCounters();
});
