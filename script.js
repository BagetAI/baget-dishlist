document.addEventListener('DOMContentLoaded', () => {
    const waitlistForm = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = waitlistForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerText = 'Creating Passport...';
            formMessage.innerText = '';
            formMessage.className = 'form-message';

            const formData = new FormData(waitlistForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Submit to the "Waitlist Signups" database
                const response = await fetch('https://baget.ai/api/public/databases/0ad4ee7d-9749-4a31-9a2f-c49a7946897b/rows', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: data }),
                });

                if (response.ok) {
                    formMessage.innerText = 'Success! Your spot in the vault is reserved.';
                    formMessage.classList.add('success');
                    waitlistForm.reset();
                    
                    // Analytics tracking
                    if (window.trackEvent) {
                        window.trackEvent('waitlist_signup_success', { city: data.city });
                    }
                } else {
                    throw new Error('Database submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                formMessage.innerText = 'Something went wrong. Please try again or email eli@team-maia.com';
                formMessage.classList.add('error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

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
window.trackEvent = function(eventName, props) {
    console.log(`[Analytics] ${eventName}`, props);
    fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, properties: props, timestamp: Date.now() })
    }).catch(() => {});
};
