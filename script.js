document.addEventListener('DOMContentLoaded', () => {
    // --- WAITLIST FORM LOGIC ---
    const waitlistForm = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = waitlistForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.disabled = true;
            submitBtn.innerText = 'Creating Passport...';
            formMessage.innerText = '';
            formMessage.className = 'form-message';

            const formData = new FormData(waitlistForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://baget.ai/api/public/databases/0ad4ee7d-9749-4a31-9a2f-c49a7946897b/rows', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: data }),
                });

                if (response.ok) {
                    formMessage.innerText = 'Success! Your spot in the vault is reserved.';
                    formMessage.classList.add('success');
                    waitlistForm.reset();
                    trackEvent('waitlist_signup_success', { city: data.city });
                } else {
                    throw new Error('Database submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                formMessage.innerText = 'Something went wrong. Please try again.';
                formMessage.classList.add('error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    // --- SEARCH DEMO LOGIC ---
    const dishSearch = document.getElementById('dishSearch');
    const searchResults = document.getElementById('searchResults');

    // Mock data for the demo widget (matches DB structure)
    const mockDishes = [
        {
            name: "Spicy Tonkotsu Ramen",
            venue: "Ippudo Ramen",
            location: "East Village, NYC",
            sentiment: "98% Positive Sentiment",
            img: "images/overhead-shot-of-a-steaming-bowl-of-spic.png"
        },
        {
            name: "Penne Pesto",
            venue: "Trattoria L'Incontro",
            location: "Queens, NYC",
            sentiment: "Best in Queens",
            img: "images/macro-shot-of-penne-pesto-pasta-with-toa.png"
        },
        {
            name: "Egg Salad Sandwich",
            venue: "The Daily Provisions",
            location: "West Village, NYC",
            sentiment: "Cult Favorite",
            img: "images/editorial-photography-of-a-gourmet-egg-s.png"
        },
        {
            name: "Spicy Tuna Crispy Rice",
            venue: "Sushi Park",
            location: "West Hollywood, LA",
            sentiment: "Highly Rated",
            img: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&q=80&w=400"
        }
    ];

    if (dishSearch && searchResults) {
        dishSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length === 0) {
                searchResults.innerHTML = '<div class="search-placeholder-msg">Start typing to explore your vault...</div>';
                return;
            }

            const filtered = mockDishes.filter(dish => 
                dish.name.toLowerCase().includes(query) || 
                dish.venue.toLowerCase().includes(query)
            );

            if (filtered.length > 0) {
                searchResults.innerHTML = filtered.map(dish => `
                    <div class="result-item">
                        <img src="${dish.img}" class="result-thumb" alt="${dish.name}">
                        <div class="result-details">
                            <div class="result-name">${dish.name}</div>
                            <div class="result-venue">${dish.venue} • ${dish.location}</div>
                        </div>
                        <div class="result-sentiment">${dish.sentiment}</div>
                    </div>
                `).join('');
                
                trackEvent('search_demo_query', { query: query, result_count: filtered.length });
            } else {
                searchResults.innerHTML = '<div class="search-placeholder-msg">No matches in your vault. Try "Ramen" or "Pesto".</div>';
            }
        });
    }

    // --- SCROLL ANIMATIONS ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('scroll-hidden');
        observer.observe(section);
    });
});

// Helper for analytics
function trackEvent(eventName, props) {
    console.log(`[Analytics] ${eventName}`, props);
    fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, properties: props, timestamp: Date.now(), url: window.location.href })
    }).catch(() => {});
}
