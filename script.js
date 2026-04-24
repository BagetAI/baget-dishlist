document.getElementById('waitlistForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const btn = form.querySelector('button');
    const status = document.getElementById('formStatus');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Disable button during submission
    btn.disabled = true;
    btn.innerText = 'Joining...';
    status.innerText = '';

    try {
        const response = await fetch('https://baget.ai/api/public/databases/0ad4ee7d-9749-4a31-9a2f-c49a7946897b/rows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: data }),
        });

        if (response.ok) {
            status.innerText = 'Welcome to the club! We will be in touch soon.';
            status.className = 'form-status success';
            form.reset();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        status.innerText = 'Something went wrong. Please try again.';
        status.className = 'form-status error';
    } finally {
        btn.disabled = false;
        btn.innerText = 'Claim My Spot';
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
