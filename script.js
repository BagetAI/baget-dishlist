document.addEventListener('DOMContentLoaded', () => {
    const DISHES_DB_ID = '2c498536-0482-4e57-ac8b-4e7b5cea3042';
    const WAITLIST_DB_ID = '0ad4ee7d-9749-4a31-9a2f-c49a7946897b';

    // --- LIVE DATA FETCHING ---
    let dishesData = [];

    async function fetchDishes() {
        try {
            const response = await fetch(`https://app.baget.ai/api/public/databases/${DISHES_DB_ID}/rows`);
            if (response.ok) {
                const data = await response.json();
                dishesData = data;
                renderRecentFeed(data);
            }
        } catch (error) {
            console.error('Error fetching dishes:', error);
            renderFallbackFeed();
        }
    }

    function renderRecentFeed(dishes) {
        const feedContainer = document.getElementById('recentDishes');
        if (!feedContainer) return;

        // Show last 6 dishes
        const recent = dishes.slice(-6).reverse();
        
        feedContainer.innerHTML = recent.map(dish => `
            <div class="recent-card">
                <div class="recent-img-box">
                    <img src="${dish.photo_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'}" alt="${dish.name}">
                </div>
                <div class="recent-content">
                    <h4>${dish.name}</h4>
                    <p class="recent-venue">${dish.venue_id}</p>
                    <div class="recent-rating">
                        ${'★'.repeat(Math.round(dish.rating))}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderFallbackFeed() {
        const feedContainer = document.getElementById('recentDishes');
        if (feedContainer) feedContainer.innerHTML = '<p>Offline: Unable to sync with Taste Vault.</p>';
    }

    // --- SEARCH DEMO LOGIC ---
    const dishSearch = document.getElementById('dishSearch');
    const searchResults = document.getElementById('searchResults');

    if (dishSearch && searchResults) {
        dishSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length === 0) {
                searchResults.innerHTML = '<div class="search-placeholder-msg">Start typing to see your memories...</div>';
                return;
            }

            // Filter both live and mock fallback
            const filtered = dishesData.filter(dish => 
                dish.name.toLowerCase().includes(query) || 
                dish.venue_id.toLowerCase().includes(query)
            );

            if (filtered.length > 0) {
                searchResults.innerHTML = filtered.map(dish => `
                    <div class="result-item">
                        <img src="${dish.photo_url}" class="result-thumb" alt="${dish.name}">
                        <div class="result-details">
                            <div class="result-name">${dish.name}</div>
                            <div class="result-venue">${dish.venue_id}</div>
                        </div>
                        <div class="result-sentiment">${dish.rating >= 4.8 ? 'Cult Favorite' : 'Highly Rated'}</div>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = '<div class="search-placeholder-msg">No matches found. Try "Burger" or "Ramen".</div>';
            }
        });
    }

    // --- QUICK LOG SIMULATION ---
    const dropZone = document.getElementById('dropZone');
    const logProcessing = document.getElementById('logProcessing');
    const logResult = document.getElementById('logResult');

    if (dropZone) {
        dropZone.addEventListener('click', () => {
            dropZone.classList.add('hidden');
            logProcessing.classList.remove('hidden');

            setTimeout(() => {
                logProcessing.classList.add('hidden');
                logResult.classList.remove('hidden');
                trackEvent('quick_log_simulation', { status: 'success' });
            }, 2500);
        });
    }

    // --- WAITLIST FORM ---
    const waitlistForm = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = waitlistForm.querySelector('button');
            btn.disabled = true;
            btn.innerText = 'Creating Passport...';

            const formData = new FormData(waitlistForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch(`https://app.baget.ai/api/public/databases/${WAITLIST_DB_ID}/rows`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: data }),
                });

                if (res.ok) {
                    formMessage.innerText = 'Success! Your spot in the vault is reserved.';
                    formMessage.className = 'form-message success';
                    waitlistForm.reset();
                    trackEvent('waitlist_signup', { city: data.city });
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                formMessage.innerText = 'Unable to join at this time. Please try later.';
                formMessage.className = 'form-message error';
            } finally {
                btn.disabled = false;
                btn.innerText = 'Join the Waitlist';
            }
        });
    }

    // Initialize
    fetchDishes();
});

function trackEvent(name, props) {
    console.log(`[DishList Tracking] ${name}`, props);
}
