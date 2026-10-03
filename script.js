/* =========================================================
   BOOK MY CLICK - GLOBAL JAVASCRIPT
   ========================================================= */

/* ---------------------------------------------------------
   MOBILE NAVIGATION
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");

            menuBtn.innerHTML =
                navLinks.classList.contains("open") ? "✕" : "☰";
        });
    }

    /* Close mobile menu after clicking */
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks) {
                navLinks.classList.remove("open");

                if (menuBtn) {
                    menuBtn.innerHTML = "☰";
                }
            }
        });
    });

    /* Active navigation link */
    setActiveNav();

    /* Initialize common features */
    initializeFavorites();
    initializeGallery();
    initializeForms();
    initializeModals();

});


/* ---------------------------------------------------------
   ACTIVE NAVIGATION
--------------------------------------------------------- */

function setActiveNav() {

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {

        const linkPage =
            link.getAttribute("href")?.split("/").pop();

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {
            link.classList.add("active");
        }
    });
}


/* ---------------------------------------------------------
   TOAST MESSAGE
--------------------------------------------------------- */

function showToast(message) {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


/* ---------------------------------------------------------
   FAVORITES
--------------------------------------------------------- */

function getFavorites() {

    try {
        return JSON.parse(
            localStorage.getItem("bookMyClickFavorites")
        ) || [];
    }

    catch {
        return [];
    }
}


function saveFavorites(favorites) {

    localStorage.setItem(
        "bookMyClickFavorites",
        JSON.stringify(favorites)
    );
}


function toggleFavorite(name, button) {

    let favorites = getFavorites();

    if (favorites.includes(name)) {

        favorites = favorites.filter(
            item => item !== name
        );

        button.classList.remove("active");

        button.innerHTML = "♡";

        showToast(`${name} removed from favorites`);

    } else {

        favorites.push(name);

        button.classList.add("active");

        button.innerHTML = "♥";

        showToast(`${name} added to favorites ❤️`);
    }

    saveFavorites(favorites);
}


function initializeFavorites() {

    const favorites = getFavorites();

    document.querySelectorAll(".favorite-btn").forEach(button => {

        const photographer =
            button.dataset.photographer;

        if (!photographer) return;

        if (favorites.includes(photographer)) {

            button.classList.add("active");

            button.innerHTML = "♥";
        }

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            toggleFavorite(
                photographer,
                button
            );
        });

    });
}


/* ---------------------------------------------------------
   SEARCH PHOTOGRAPHERS
--------------------------------------------------------- */

function setupPhotographerSearch() {

    const searchInput =
        document.querySelector("#photographerSearch");

    const cards =
        document.querySelectorAll(".photographer-card");

    if (!searchInput || !cards.length) return;

    searchInput.addEventListener("input", () => {

        const searchValue =
            searchInput.value.toLowerCase().trim();

        let visibleCount = 0;

        cards.forEach(card => {

            const text =
                card.textContent.toLowerCase();

            if (text.includes(searchValue)) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";
            }

        });

        let emptyMessage =
            document.querySelector(".search-empty");

        if (visibleCount === 0) {

            if (!emptyMessage) {

                emptyMessage =
                    document.createElement("div");

                emptyMessage.className =
                    "empty-state search-empty";

                emptyMessage.innerHTML = `
                    <h3>No photographers found</h3>
                    <p>Try another name, location or category.</p>
                `;

                cards[0]?.parentElement?.appendChild(
                    emptyMessage
                );
            }

        } else {

            emptyMessage?.remove();
        }

    });
}


/* ---------------------------------------------------------
   CATEGORY FILTER
--------------------------------------------------------- */

function setupCategoryFilters() {

    const buttons =
        document.querySelectorAll(".filter-btn");

    const cards =
        document.querySelectorAll(".photographer-card");

    if (!buttons.length || !cards.length) return;

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const category =
                button.dataset.category;

            cards.forEach(card => {

                const cardCategory =
                    card.dataset.category;

                if (
                    category === "all" ||
                    !category ||
                    cardCategory === category
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";
                }

            });

        });

    });
}


/* ---------------------------------------------------------
   GALLERY LIGHTBOX
--------------------------------------------------------- */

function initializeGallery() {

    const galleryImages =
        document.querySelectorAll(".gallery-item img");

    if (!galleryImages.length) return;

    let lightbox =
        document.querySelector(".lightbox");

    if (!lightbox) {

        lightbox = document.createElement("div");

        lightbox.className = "lightbox";

        lightbox.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <img src="" alt="Gallery Image">
        `;

        document.body.appendChild(lightbox);
    }

    const lightboxImage =
        lightbox.querySelector("img");

    const closeButton =
        lightbox.querySelector(".lightbox-close");

    galleryImages.forEach(image => {

        image.parentElement.addEventListener(
            "click",
            () => {

                lightboxImage.src = image.src;

                lightboxImage.alt =
                    image.alt || "Photography";

                lightbox.classList.add("show");

                document.body.classList.add(
                    "no-scroll"
                );
            }
        );

    });

    function closeLightbox() {

        lightbox.classList.remove("show");

        document.body.classList.remove(
            "no-scroll"
        );
    }

    closeButton.addEventListener(
        "click",
        closeLightbox
    );

    lightbox.addEventListener(
        "click",
        event => {

            if (event.target === lightbox) {
                closeLightbox();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                lightbox.classList.contains("show")
            ) {
                closeLightbox();
            }

        }
    );
}


/* ---------------------------------------------------------
   MODALS
--------------------------------------------------------- */

function initializeModals() {

    document.querySelectorAll(
        "[data-modal]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modalId =
                    button.dataset.modal;

                const modal =
                    document.getElementById(modalId);

                if (modal) {
                    openModal(modal);
                }
            }
        );

    });

    document.querySelectorAll(
        ".modal-close"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modal =
                    button.closest(".modal");

                closeModal(modal);
            }
        );

    });

    document.querySelectorAll(
        ".modal"
    ).forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {
                    closeModal(modal);
                }
            }
        );

    });

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                document.querySelectorAll(
                    ".modal.show"
                ).forEach(modal => {
                    closeModal(modal);
                });

            }

        }
    );
}


function openModal(modal) {

    if (!modal) return;

    modal.classList.add("show");

    document.body.classList.add(
        "no-scroll"
    );
}


function closeModal(modal) {

    if (!modal) return;

    modal.classList.remove("show");

    document.body.classList.remove(
        "no-scroll"
    );
}


/* ---------------------------------------------------------
   CONTACT PHOTOGRAPHER
--------------------------------------------------------- */

function contactPhotographer(name) {

    const phone =
        document.querySelector("#contactPhone");

    const photographerName =
        document.querySelector("#contactPhotographerName");

    if (photographerName) {
        photographerName.textContent = name;
    }

    if (phone) {

        phone.innerHTML = `
            <a href="tel:+919876543210">
                +91 98765 43210
            </a>
        `;
    }

    const email =
        document.querySelector("#contactEmail");

    if (email) {

        email.innerHTML = `
            <a href="mailto:bookmyclick.demo@gmail.com">
                bookmyclick.demo@gmail.com
            </a>
        `;
    }

    const modal =
        document.querySelector("#contactModal");

    if (modal) {
        openModal(modal);
    }
}


/* ---------------------------------------------------------
   CHAT
--------------------------------------------------------- */

function openChat(name) {

    const chatName =
        document.querySelector("#chatPhotographerName");

    if (chatName) {
        chatName.textContent = name;
    }

    const modal =
        document.querySelector("#chatModal");

    if (modal) {

        openModal(modal);

        const input =
            modal.querySelector("input");

        input?.focus();

    } else {

        showToast(
            `Chat with ${name} is available in the demo.`
        );
    }
}


function sendChatMessage() {

    const input =
        document.querySelector("#chatInput");

    if (!input) return;

    const message =
        input.value.trim();

    if (!message) {

        showToast(
            "Please type a message first."
        );

        return;
    }

    showToast(
        "Message sent successfully! 💬"
    );

    input.value = "";
}


/* ---------------------------------------------------------
   BOOKING
--------------------------------------------------------- */

function openBooking(name) {

    const bookingName =
        document.querySelector("#bookingPhotographerName");

    if (bookingName) {
        bookingName.textContent = name;
    }

    const hiddenName =
        document.querySelector("#bookingPhotographer");

    if (hiddenName) {
        hiddenName.value = name;
    }

    const modal =
        document.querySelector("#bookingModal");

    if (modal) {

        openModal(modal);

    } else {

        showToast(
            `Booking enquiry for ${name} opened.`
        );
    }
}


/* ---------------------------------------------------------
   BOOKING FORM
--------------------------------------------------------- */

function handleBooking(event) {

    event.preventDefault();

    const form =
        event.target;

    const photographer =
        form.querySelector(
            "[name='photographer']"
        )?.value || "photographer";

    showToast(
        `Booking enquiry sent to ${photographer}! 📸`
    );

    form.reset();

    const modal =
        form.closest(".modal");

    if (modal) {
        setTimeout(() => {
            closeModal(modal);
        }, 700);
    }
}


/* ---------------------------------------------------------
   CONTACT FORM
--------------------------------------------------------- */

function handleContactForm(event) {

    event.preventDefault();

    const name =
        event.target.querySelector(
            "[name='name']"
        )?.value || "there";

    showToast(
        `Thank you ${name}! Your enquiry has been received.`
    );

    event.target.reset();
}


/* ---------------------------------------------------------
   GENERAL FORMS
--------------------------------------------------------- */

function initializeForms() {

    document.querySelectorAll(
        "form"
    ).forEach(form => {

        /* Booking form */
        if (
            form.id === "bookingForm"
        ) {

            form.addEventListener(
                "submit",
                handleBooking
            );

            return;
        }

        /* Contact form */
        if (
            form.id === "contactForm"
        ) {

            form.addEventListener(
                "submit",
                handleContactForm
            );

        }

    });

    /* Search */
    setupPhotographerSearch();

    /* Filters */
    setupCategoryFilters();
}


/* ---------------------------------------------------------
   RANDOM DEMO CONTACT DETAILS
--------------------------------------------------------- */

function generateDemoContact() {

    const phoneNumbers = [
        "+91 98765 43210",
        "+91 91234 56789",
        "+91 99887 76655",
        "+91 90123 45678"
    ];

    const emails = [
        "hello@bookmyclick.demo",
        "contact@bookmyclick.demo",
        "photography@bookmyclick.demo",
        "support@bookmyclick.demo"
    ];

    const phoneElement =
        document.querySelector("#demoPhone");

    const emailElement =
        document.querySelector("#demoEmail");

    if (phoneElement) {

        phoneElement.textContent =
            phoneNumbers[
                Math.floor(
                    Math.random() *
                    phoneNumbers.length
                )
            ];
    }

    if (emailElement) {

        emailElement.textContent =
            emails[
                Math.floor(
                    Math.random() *
                    emails.length
                )
            ];
    }
}


/* ---------------------------------------------------------
   SCROLL TO TOP
--------------------------------------------------------- */

function createScrollTopButton() {

    const button =
        document.createElement("button");

    button.innerHTML = "↑";

    button.style.cssText = `
        position:fixed;
        right:20px;
        bottom:20px;
        width:45px;
        height:45px;
        border:none;
        border-radius:50%;
        background:#e85d75;
        color:white;
        font-size:20px;
        display:none;
        z-index:1500;
        box-shadow:0 8px 20px rgba(0,0,0,.18);
    `;

    document.body.appendChild(button);

    window.addEventListener(
        "scroll",
        () => {

            button.style.display =
                window.scrollY > 400
                    ? "block"
                    : "none";

        }
    );

    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );
}


document.addEventListener(
    "DOMContentLoaded",
    createScrollTopButton
);


/* ---------------------------------------------------------
   COUNTER ANIMATION
--------------------------------------------------------- */

function animateCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );

    counters.forEach(counter => {

        const target =
            Number(
                counter.dataset.counter
            );

        let current = 0;

        const increment =
            Math.max(
                1,
                Math.ceil(target / 60)
            );

        const timer =
            setInterval(() => {

                current += increment;

                if (current >= target) {

                    current = target;

                    clearInterval(timer);
                }

                counter.textContent =
                    current.toLocaleString();

            }, 25);

    });
}


document.addEventListener(
    "DOMContentLoaded",
    animateCounters
);


/* ---------------------------------------------------------
   DYNAMIC PHOTOGRAPHER PROFILE
--------------------------------------------------------- */

const photographerData = {

    "Dream Lens Studio": {
        category: "Wedding Photography",
        location: "Vijayawada",
        rating: "4.9",
        reviews: "128",
        experience: "8+ Years",
        events: "350+",
        availability: "Available",
        phone: "+91 98765 43210",
        email: "dreamlens@bookmyclick.demo"
    },

    "Royal Frames": {
        category: "Wedding Photography",
        location: "Hyderabad",
        rating: "4.8",
        reviews: "96",
        experience: "7+ Years",
        events: "280+",
        availability: "Available",
        phone: "+91 91234 56789",
        email: "royalframes@bookmyclick.demo"
    },

    "Forever Clicks": {
        category: "Wedding Photography",
        location: "Guntur",
        rating: "4.9",
        reviews: "112",
        experience: "6+ Years",
        events: "300+",
        availability: "Available",
        phone: "+91 99887 76655",
        email: "foreverclicks@bookmyclick.demo"
    },

    "Frame Stories": {
        category: "Wedding Photography",
        location: "Vijayawada",
        rating: "4.7",
        reviews: "85",
        experience: "5+ Years",
        events: "210+",
        availability: "Available",
        phone: "+91 90123 45678",
        email: "framestories@bookmyclick.demo"
    },

    "Pixel Portraits": {
        category: "Portrait Photography",
        location: "Hyderabad",
        rating: "4.8",
        reviews: "74",
        experience: "5+ Years",
        events: "190+",
        availability: "Available",
        phone: "+91 98765 11111",
        email: "pixelportraits@bookmyclick.demo"
    },

    "Lens & Light": {
        category: "Portrait Photography",
        location: "Vijayawada",
        rating: "4.7",
        reviews: "67",
        experience: "4+ Years",
        events: "170+",
        availability: "Busy",
        phone: "+91 98765 22222",
        email: "lenslight@bookmyclick.demo"
    },

    "Click Moments": {
        category: "Event Photography",
        location: "Vijayawada",
        rating: "4.9",
        reviews: "103",
        experience: "7+ Years",
        events: "270+",
        availability: "Available",
        phone: "+91 98765 33333",
        email: "clickmoments@bookmyclick.demo"
    },

    "Eventure Photography": {
        category: "Event Photography",
        location: "Hyderabad",
        rating: "4.8",
        reviews: "91",
        experience: "6+ Years",
        events: "240+",
        availability: "Available",
        phone: "+91 98765 44444",
        email: "eventure@bookmyclick.demo"
    },

    "Moments Hub": {
        category: "Event Photography",
        location: "Guntur",
        rating: "4.6",
        reviews: "58",
        experience: "4+ Years",
        events: "150+",
        availability: "Available",
        phone: "+91 98765 55555",
        email: "momentshub@bookmyclick.demo"
    },

    "Corporate Clicks": {
        category: "Corporate Photography",
        location: "Hyderabad",
        rating: "4.9",
        reviews: "82",
        experience: "8+ Years",
        events: "320+",
        availability: "Available",
        phone: "+91 98765 66666",
        email: "corporateclicks@bookmyclick.demo"
    },

    "Business Lens": {
        category: "Corporate Photography",
        location: "Vijayawada",
        rating: "4.7",
        reviews: "61",
        experience: "5+ Years",
        events: "180+",
        availability: "Available",
        phone: "+91 98765 77777",
        email: "businesslens@bookmyclick.demo"
    },

    "ProShot Studio": {
        category: "Corporate Photography",
        location: "Guntur",
        rating: "4.8",
        reviews: "70",
        experience: "6+ Years",
        events: "200+",
        availability: "Busy",
        phone: "+91 98765 88888",
        email: "proshot@bookmyclick.demo"
    }

};


/* ---------------------------------------------------------
   LOAD PROFILE DATA FROM URL
--------------------------------------------------------- */

function loadPhotographerProfile() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const name =
        params.get("name");

    if (!name) return;

    const data =
        photographerData[name];

    if (!data) return;

    const nameElements =
        document.querySelectorAll(
            "[data-profile-name]"
        );

    nameElements.forEach(element => {
        element.textContent = name;
    });

    const categoryElements =
        document.querySelectorAll(
            "[data-profile-category]"
        );

    categoryElements.forEach(element => {
        element.textContent = data.category;
    });

    const locationElements =
        document.querySelectorAll(
            "[data-profile-location]"
        );

    locationElements.forEach(element => {
        element.textContent = data.location;
    });

    const ratingElements =
        document.querySelectorAll(
            "[data-profile-rating]"
        );

    ratingElements.forEach(element => {
        element.textContent = data.rating;
    });

    const reviewElements =
        document.querySelectorAll(
            "[data-profile-reviews]"
        );

    reviewElements.forEach(element => {
        element.textContent = data.reviews;
    });

    const experienceElements =
        document.querySelectorAll(
            "[data-profile-experience]"
        );

    experienceElements.forEach(element => {
        element.textContent = data.experience;
    });

    const eventElements =
        document.querySelectorAll(
            "[data-profile-events]"
        );

    eventElements.forEach(element => {
        element.textContent = data.events;
    });

    const availabilityElements =
        document.querySelectorAll(
            "[data-profile-availability]"
        );

    availabilityElements.forEach(element => {
        element.textContent = data.availability;
    });

    document.title =
        `${name} | Book My Click`;

}


/* Run profile loader */
document.addEventListener(
    "DOMContentLoaded",
    loadPhotographerProfile
);
/* =========================================
   USER LOGIN SYSTEM
========================================= */

function openLoginModal() {

    const modal =
        document.getElementById("loginModal");

    if (modal) {
        modal.classList.add("show");
        document.body.classList.add("no-scroll");
    }
}


function closeLoginModal() {

    const modal =
        document.getElementById("loginModal");

    if (modal) {
        modal.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }
}


/* =========================================
   LOGIN
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById("loginForm");

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    const name =
                        document.getElementById(
                            "userName"
                        ).value.trim();

                    const email =
                        document.getElementById(
                            "userEmail"
                        ).value.trim();

                    const phone =
                        document.getElementById(
                            "userPhone"
                        ).value.trim();


                    const user = {
                        name: name,
                        email: email,
                        phone: phone
                    };


                    localStorage.setItem(
                        "bookMyClickUser",
                        JSON.stringify(user)
                    );


                    closeLoginModal();

                    updateUserNavbar();

                    showToast(
                        "Welcome to Book My Click, " +
                        name +
                        " ❤️"
                    );

                }
            );

        }


        updateUserNavbar();

    }
);


/* =========================================
   UPDATE NAVBAR
========================================= */

function updateUserNavbar() {

    const savedUser =
        localStorage.getItem(
            "bookMyClickUser"
        );


    const loginButton =
        document.querySelector(
            ".login-btn"
        );

    const profileButton =
        document.querySelector(
            ".user-profile-btn"
        );


    if (savedUser) {

        if (loginButton) {
            loginButton.style.display =
                "none";
        }

        if (profileButton) {
            profileButton.style.display =
                "flex";

            profileButton.style.alignItems =
                "center";

            profileButton.style.justifyContent =
                "center";
        }

    } else {

        if (loginButton) {
            loginButton.style.display =
                "block";
        }

        if (profileButton) {
            profileButton.style.display =
                "none";
        }

    }
}


/* =========================================
   OPEN USER PROFILE
========================================= */

function openUserProfile() {

    const savedUser =
        localStorage.getItem(
            "bookMyClickUser"
        );


    if (!savedUser) {

        openLoginModal();

        return;
    }


    const user =
        JSON.parse(savedUser);


    document.getElementById(
        "displayUserName"
    ).textContent =
        user.name;


    document.getElementById(
        "displayUserEmail"
    ).textContent =
        user.email;


    document.getElementById(
        "displayUserPhone"
    ).textContent =
        user.phone;


    const modal =
        document.getElementById(
            "userProfileModal"
        );


    if (modal) {

        modal.classList.add("show");

        document.body.classList.add(
            "no-scroll"
        );
    }
}


/* =========================================
   CLOSE PROFILE
========================================= */

function closeUserProfile() {

    const modal =
        document.getElementById(
            "userProfileModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "no-scroll"
        );
    }
}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem(
        "bookMyClickUser"
    );


    closeUserProfile();

    updateUserNavbar();


    showToast(
        "You have been logged out."
    );
}