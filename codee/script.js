let slideIndex = 0; 
let slides = document.getElementsByClassName("slide");
let dots = document.getElementsByClassName("dot");

// --- Core Function: Show a specific slide ---
function showSlides(n) {
    let i;

    // Standard index boundary checks
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }

    // 1. Hide all slides and remove 'active' classes
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active"); // Remove active class for text animation reset
    }

    // 2. Deactivate all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // 3. Show the current slide and ADD the 'active' class
    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add("active"); // <-- This triggers the text fade-in
    
    // 4. Activate the corresponding dot
    dots[slideIndex - 1].className += " active";
}

// --- Manual Navigation Function (used by the dots) ---
function currentSlide(n) {
    slideIndex = n; 
    showSlides(slideIndex);
}

// --- Automatic Sliding Function ---
function autoShowSlides() {
    
    // 1. Increment index
    slideIndex++;

    // 2. Loop check
    if (slideIndex > slides.length) {
        slideIndex = 1
    }

    // 3. Display the slide (using the modified showSlides function logic)
    // We reuse the showSlides function to handle all the hiding/showing/class management
    showSlides(slideIndex); 

    // 4. Call the function again after 3000 milliseconds (3 seconds)
    setTimeout(autoShowSlides, 3000);
}

// Start the slider when the page loads
document.addEventListener("DOMContentLoaded", autoShowSlides);


document.addEventListener('DOMContentLoaded', function() {
        const wrapper = document.getElementById('reviewWrapper');
        
        // Get the inner content
        const content = wrapper.innerHTML;
        
        // Duplicate the content. This is what allows the 'infinite' loop.
        wrapper.innerHTML += content;
  });
