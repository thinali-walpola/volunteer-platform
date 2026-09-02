// =====================================================
// VOLUNTEERMATCH - MAIN SCRIPT
// =====================================================


// Check whether this is the full opportunities page
const isOpportunityPage =
    window.location.pathname.includes("opportunity.html");


// =====================================================
// USER PROFILE
// =====================================================

let volunteer =
    JSON.parse(
        localStorage.getItem("volunteerProfile")
    ) || {

        name: "",

        location: "",

        availability: "",

        skills: [],

        interests: []

    };


// =====================================================
// SAVED OPPORTUNITIES
// =====================================================

// sessionStorage means:
// - saved jobs stay when moving between pages
// - saved jobs disappear when the browser session/tab closes

let savedOpportunities =
    JSON.parse(
        sessionStorage.getItem("savedOpportunities")
    ) || [];


// =====================================================
// OPPORTUNITIES DATA
// =====================================================

const opportunities = [

    {
        id: 1,

        title: "Math Tutor",

        organization: "Bright Future Foundation",

        category: "Education",

        location: "Colombo",

        availability: "Weekends",

        skills: [
            "Mathematics",
            "Teaching"
        ],

        description:
            "Help school students improve their mathematics skills through friendly tutoring sessions."
    },


    {
        id: 2,

        title: "Beach Cleanup Volunteer",

        organization: "Green Sri Lanka",

        category: "Environment",

        location: "Negombo",

        availability: "Weekends",

        skills: [
            "Communication",
            "Teamwork"
        ],

        description:
            "Join a community team working to keep Sri Lanka's beaches clean and environmentally friendly."
    },


    {
        id: 3,

        title: "Community Teaching Assistant",

        organization: "Community Education Center",

        category: "Community",

        location: "Colombo",

        availability: "Evenings",

        skills: [
            "Teaching",
            "Communication"
        ],

        description:
            "Assist teachers with community education programs and support students during evening classes."
    },


    {
        id: 4,

        title: "Hospital Support Volunteer",

        organization: "Care Lanka",

        category: "Healthcare",

        location: "Gampaha",

        availability: "Weekdays",

        skills: [
            "Communication",
            "Teamwork"
        ],

        description:
            "Support hospital staff and patients with basic non-medical volunteer activities."
    },


    {
        id: 5,

        title: "Web Development Volunteer",

        organization: "Tech For Good",

        category: "Technology",

        location: "Colombo",

        availability: "Flexible",

        skills: [
            "JavaScript",
            "HTML",
            "CSS"
        ],

        description:
            "Use your web development skills to help create websites for community organizations."
    },


    {
        id: 6,

        title: "English Teaching Volunteer",

        organization: "Learn Together",

        category: "Education",

        location: "Kandy",

        availability: "Weekends",

        skills: [
            "Teaching",
            "Communication"
        ],

        description:
            "Help students improve their English communication and language skills."
    },


    {
        id: 7,

        title: "Community Food Distribution",

        organization: "Helping Hands",

        category: "Community",

        location: "Colombo",

        availability: "Weekends",

        skills: [
            "Teamwork",
            "Communication"
        ],

        description:
            "Help distribute food and essential supplies to families in need."
    },


    {
        id: 8,

        title: "School Computer Assistant",

        organization: "Digital Future",

        category: "Technology",

        location: "Colombo",

        availability: "Weekends",

        skills: [
            "HTML",
            "JavaScript",
            "Communication"
        ],

        description:
            "Assist students and teachers with basic computer and technology activities."
    }

];


// =====================================================
// MATCH CALCULATION
// =====================================================

function calculateMatch(opportunity) {

    let score = 0;


    // -------------------------
    // SKILLS - 30%
    // -------------------------

    if (
        volunteer.skills &&
        volunteer.skills.length > 0
    ) {

        const matchingSkills =
            opportunity.skills.filter(
                skill =>
                    volunteer.skills.includes(skill)
            );

        const skillScore =
            Math.min(
                matchingSkills.length * 10,
                30
            );

        score += skillScore;
    }


    // -------------------------
    // LOCATION - 20%
    // -------------------------

    if (
        volunteer.location &&
        volunteer.location === opportunity.location
    ) {

        score += 20;

    }


    // -------------------------
    // AVAILABILITY - 20%
    // -------------------------

    if (
        volunteer.availability &&
        volunteer.availability ===
        opportunity.availability
    ) {

        score += 20;

    }
    else if (
        volunteer.availability === "Flexible"
    ) {

        score += 15;

    }


    // -------------------------
    // INTEREST - 20%
    // -------------------------

    if (
        volunteer.interests &&
        volunteer.interests.includes(
            opportunity.category
        )
    ) {

        score += 20;

    }


    // -------------------------
    // CATEGORY BONUS - 10%
    // -------------------------

    if (
        volunteer.interests &&
        volunteer.interests.length > 0 &&
        volunteer.interests.includes(
            opportunity.category
        )
    ) {

        // Interest already gives 20.
        // No additional category bonus needed.
        // This prevents the score from exceeding 100.

    }


    return {

        score: Math.min(score, 100)

    };

}


// =====================================================
// MATCH LEVEL
// =====================================================

function getMatchLevel(score) {

    if (score >= 80) {

        return "Excellent Match";

    }

    if (score >= 60) {

        return "Good Match";

    }

    if (score >= 40) {

        return "Fair Match";

    }

    return "Low Match";

}


// =====================================================
// DISPLAY OPPORTUNITIES
// =====================================================

function displayOpportunities() {

    const container =
        document.getElementById(
            "opportunityContainer"
        );

    if (!container) {

        return;

    }


    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";


    let results =
        opportunities.filter(
            opportunity => {

                const matchesSearch =

                    opportunity.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    opportunity.organization
                        .toLowerCase()
                        .includes(search)

                    ||

                    opportunity.category
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =

                    category === "all"

                    ||

                    opportunity.category ===
                    category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    // =================================================
    // CALCULATE MATCH
    // =================================================

    results =
        results.map(
            opportunity => ({

                ...opportunity,

                match:
                    calculateMatch(
                        opportunity
                    )

            })
        );


    // =================================================
    // SORT BY MATCH
    // =================================================

    results.sort(
        (a, b) =>
            b.match.score -
            a.match.score
    );


    // =================================================
    // INDEX PAGE = ONLY 3
    // OPPORTUNITY PAGE = ALL
    // =================================================

    if (!isOpportunityPage) {

        results =
            results.slice(0, 3);

    }


    // =================================================
    // NO RESULTS
    // =================================================

    if (results.length === 0) {

        container.innerHTML = `

            <div class="no-results">

                <h3>
                    No opportunities found
                </h3>

                <p>
                    Try changing your search or filter.
                </p>

            </div>

        `;

        updateStats();

        return;

    }


    // =================================================
    // CREATE CARDS
    // =================================================

    container.innerHTML =
        results.map(
            opportunity => {

                const isSaved =
                    savedOpportunities.includes(
                        opportunity.id
                    );


                return `

                    <div class="opportunity-card">

                        <div class="opportunity-top">

                            <span class="category-badge">
                                ${opportunity.category}
                            </span>

                            <button
                                class="save-btn ${isSaved ? "saved" : ""}"
                                onclick="toggleSave(${opportunity.id})"
                                title="Save opportunity"
                            >
                                ${isSaved ? "❤️" : "♡"}
                            </button>

                        </div>


                        <h3>
                            ${opportunity.title}
                        </h3>


                        <p class="organization">
                            ${opportunity.organization}
                        </p>


                        <div class="opportunity-info">

                            <span>
                                📍
                                ${opportunity.location}
                            </span>

                            <span>
                                🕒
                                ${opportunity.availability}
                            </span>

                        </div>


                        <div class="match-score">

                            <strong>
                                ${opportunity.match.score}%
                            </strong>

                            <span>
                                ${getMatchLevel(
                                    opportunity.match.score
                                )}
                            </span>

                        </div>


                        <div class="card-buttons">

                            <button
                                class="apply-btn"
                                onclick="applyOpportunity(${opportunity.id})"
                            >
                                Apply
                            </button>


                            <button
                                class="details-btn"
                                onclick="showDetails(${opportunity.id})"
                            >
                                Details
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");


    updateStats();

}


// =====================================================
// SAVE / UNSAVE OPPORTUNITY
// =====================================================

function toggleSave(id) {

    const index =
        savedOpportunities.indexOf(id);


    if (index === -1) {

        savedOpportunities.push(id);

    }
    else {

        savedOpportunities.splice(
            index,
            1
        );

    }


    // Save to sessionStorage

    sessionStorage.setItem(
        "savedOpportunities",
        JSON.stringify(
            savedOpportunities
        )
    );


    // Refresh cards on current page

    displayOpportunities();

}


// =====================================================
// UPDATE DASHBOARD STATS
// =====================================================

function updateStats() {

    const matchCount =
        document.getElementById(
            "matchCount"
        );

    const savedCount =
        document.getElementById(
            "savedCount"
        );

    const bestMatch =
        document.getElementById(
            "bestMatch"
        );


    // opportunity.html does not have these elements

    if (
        !matchCount ||
        !savedCount ||
        !bestMatch
    ) {

        return;

    }


    const scores =
        opportunities.map(
            opportunity =>
                calculateMatch(
                    opportunity
                ).score
        );


    const goodMatches =
        scores.filter(
            score => score >= 60
        );


    const best =
        Math.max(...scores);


    matchCount.textContent =
        goodMatches.length;


    savedCount.textContent =
        savedOpportunities.length;


    bestMatch.textContent =
        best + "%";

}


// =====================================================
// SHOW DETAILS
// =====================================================

function showDetails(id) {

    const opportunity =
        opportunities.find(
            item => item.id === id
        );


    if (!opportunity) {

        return;

    }


    const modal =
        document.getElementById(
            "modal"
        );

    const modalContent =
        document.getElementById(
            "modalContent"
        );


    if (!modal || !modalContent) {

        return;

    }


    const match =
        calculateMatch(
            opportunity
        );


    modalContent.innerHTML = `

        <span class="category-badge">
            ${opportunity.category}
        </span>


        <h2>
            ${opportunity.title}
        </h2>


        <h4>
            ${opportunity.organization}
        </h4>


        <p>
            ${opportunity.description}
        </p>


        <div class="modal-info">

            <p>
                📍
                <strong>Location:</strong>
                ${opportunity.location}
            </p>

            <p>
                🕒
                <strong>Availability:</strong>
                ${opportunity.availability}
            </p>

            <p>
                🎯
                <strong>Match:</strong>
                ${match.score}%
            </p>

        </div>


        <div class="skills-list">

            <strong>
                Required Skills:
            </strong>

            <div>

                ${opportunity.skills
                    .map(
                        skill =>
                            `<span>${skill}</span>`
                    )
                    .join("")
                }

            </div>

        </div>


        <button
            class="apply-btn modal-apply"
            onclick="applyOpportunity(${opportunity.id})"
        >
            Apply for This Opportunity
        </button>

    `;


    modal.classList.add("active");

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// =====================================================
// APPLY
// =====================================================

function applyOpportunity(id) {

    const opportunity =
        opportunities.find(
            item => item.id === id
        );


    if (!opportunity) {

        return;

    }


    alert(
        "Thank you for your interest in " +
        opportunity.title +
        "! Application functionality can be connected to a backend later."
    );

}


// =====================================================
// SAVE PROFILE
// =====================================================

function saveProfile() {

    const name =
        document.getElementById(
            "userName"
        );


    const location =
        document.getElementById(
            "userLocation"
        );


    const availability =
        document.getElementById(
            "userAvailability"
        );


    if (!name || !location || !availability) {

        return;

    }


    const skills =
        Array.from(
            document.querySelectorAll(
                ".skill:checked"
            )
        ).map(
            checkbox =>
                checkbox.value
        );


    const interests =
        Array.from(
            document.querySelectorAll(
                ".interest:checked"
            )
        ).map(
            checkbox =>
                checkbox.value
        );


    volunteer = {

        name:
            name.value.trim(),

        location:
            location.value,

        availability:
            availability.value,

        skills:
            skills,

        interests:
            interests

    };


    localStorage.setItem(
        "volunteerProfile",
        JSON.stringify(
            volunteer
        )
    );


    displayOpportunities();


    alert(
        "Your volunteer profile has been saved!"
    );

}


// =====================================================
// LOAD PROFILE
// =====================================================

function loadProfile() {

    const name =
        document.getElementById(
            "userName"
        );


    const location =
        document.getElementById(
            "userLocation"
        );


    const availability =
        document.getElementById(
            "userAvailability"
        );


    if (!name || !location || !availability) {

        return;

    }


    name.value =
        volunteer.name || "";


    location.value =
        volunteer.location || "";


    availability.value =
        volunteer.availability || "";


    document
        .querySelectorAll(
            ".skill"
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    volunteer.skills.includes(
                        checkbox.value
                    );

            }
        );


    document
        .querySelectorAll(
            ".interest"
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    volunteer.interests.includes(
                        checkbox.value
                    );

            }
        );

}


// =====================================================
// CLEAR PROFILE
// =====================================================

function clearProfile() {

    volunteer = {

        name: "",

        location: "",

        availability: "",

        skills: [],

        interests: []

    };


    localStorage.removeItem(
        "volunteerProfile"
    );


    loadProfile();

    displayOpportunities();

}


// =====================================================
// FIND MATCHES
// =====================================================

function findMatches() {

    const opportunitiesSection =
        document.getElementById(
            "opportunities"
        );


    if (opportunitiesSection) {

        opportunitiesSection.scrollIntoView({

            behavior: "smooth"

        });

    }


    displayOpportunities();

}


// =====================================================
// SCROLL TO PROFILE
// =====================================================

function scrollToProfile() {

    const profile =
        document.getElementById(
            "profile"
        );


    if (profile) {

        profile.scrollIntoView({

            behavior: "smooth"

        });

    }

}


// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "modal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadProfile();

        displayOpportunities();

        updateStats();

    }
);
