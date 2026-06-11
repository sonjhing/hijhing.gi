// ===== Ripple Effect on Background Click =====
document.addEventListener('click', function(e) {
    // Ignore clicks on letters
    if (e.target.closest('.letter')) return;

    var container = document.getElementById('ripple-container');
    var maxSize = Math.max(window.innerWidth, window.innerHeight) * 1.5;

    // Create glow flash at click point
    var glow = document.createElement('div');
    glow.className = 'ripple-glow';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    container.appendChild(glow);
    glow.addEventListener('animationend', function() { glow.remove(); });

    // Create 3 concentric ripples with glow
    for (var i = 0; i < 3; i++) {
        var ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.width = maxSize + 'px';
        ripple.style.height = maxSize + 'px';
        ripple.style.animationDelay = (i * 0.15) + 's';
        ripple.style.animationDuration = (1.8 + i * 0.3) + 's';
        container.appendChild(ripple);

        // Cleanup after animation
        ripple.addEventListener('animationend', function() {
            ripple.remove();
        });
    }
});

// ===== Letter Hover Sound-like Visual Feedback =====
document.querySelectorAll('.letter').forEach(function(letter) {
    letter.addEventListener('mouseenter', function() {
        // Add a subtle pulse to the fruit image
        var fruit = document.querySelector('.fruit-img');
        if (fruit) {
            fruit.style.transition = 'filter 0.4s ease, transform 0.4s ease';
            fruit.style.filter = 'brightness(0.85) saturate(1.5)';
            fruit.style.transform = 'scale(1.03)';
        }
    });

    letter.addEventListener('mouseleave', function() {
        var fruit = document.querySelector('.fruit-img');
        if (fruit) {
            fruit.style.filter = 'brightness(0.7) saturate(1.3)';
            fruit.style.transform = 'scale(1)';
        }
    });
});

// ===== Subtle Parallax on Mouse Move =====
var hero = document.getElementById('hero');
if (hero) {
    document.addEventListener('mousemove', function(e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;

        var fruit = document.querySelector('.fruit-wrapper');
        if (fruit) {
            fruit.style.transform = 'translate(calc(-50% + ' + (x * -10) + 'px), calc(-50% + ' + (y * -10) + 'px))';
        }

        var quote = document.getElementById('quote');
        if (quote) {
            quote.style.transform = 'translate(' + (x * 5) + 'px, ' + (y * 5) + 'px)';
        }
    });
}
