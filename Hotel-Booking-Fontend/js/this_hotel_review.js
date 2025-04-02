

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hotel_id = urlParams.get('hotelId');
    const reviewContainer = document.getElementById('reviews-container');


    const fetchAndRenderReviews = async () => {
        try {

            const response = await fetch(`https://hotel-booking-website-backend.vercel.app/hotel/review_add/?hotel_id=${hotel_id}/`);
            const reviews = await response.json();

            if (reviews.length === 0) {
                renderNoReviewsMessage();
                return;
            }


            const allReviewsResponse = await fetch('https://hotel-booking-website-backend.vercel.app/hotel/reviews/');
            const allReviews = await allReviewsResponse.json();

            renderReviews(reviews, allReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            renderErrorMessage();
        }
    };

    const renderNoReviewsMessage = () => {
        const noReviewsMessage = createHTMLElement(`
            <div class="no-reviews-message text-center m-auto">
                <p class="py-5">No reviews for this hotel yet. Be the first to review!</p>
            </div>
        `);
        reviewContainer.appendChild(noReviewsMessage);
    };


    const renderReviews = (reviews, allReviews) => {
        const reviewCards = [];
        reviews.forEach(review => {
            const matchedReview = allReviews.find(ar => ar.id === review.id);
            if (matchedReview) {
                const reviewCard = createReviewCard(matchedReview);
                reviewCards.push(reviewCard);
            }
        });

        if (reviewCards.length > 0) {
            reviewContainer.innerHTML = '';
            if (reviewCards.length >= 3) {
                const carouselContainer = document.createElement('div');
                carouselContainer.className = 'owl-carousel testimonial-carousel';
                reviewCards.forEach(reviewCard => {
                    carouselContainer.appendChild(reviewCard);
                });
                reviewContainer.appendChild(carouselContainer);
                initializeCarousel();
            } else {
                reviewCards.forEach(reviewCard => {
                    reviewContainer.appendChild(reviewCard);
                });
            }
        } else {
            renderNoReviewsMessage();
        }
    };


    const createReviewCard = (review) => {
        const tr_body = truncateText(review.body, 110);
        const reviewCard = createHTMLElement(`
            <div class="testimonial-item shadow text-center rounded pb-4 mb-2 mt-2 ">
                <div class="testimonial-comment bg-light rounded p-4">
                    <h3>${review.hotel.name}</h3>
                    <p class="text-center mb-5">${tr_body}</p>
                </div>
                <div class="testimonial-img p-1">
                    <img src="img/user.png" class="img-fluid rounded-circle" alt="Image">
                </div>
                <div style="margin-top: -35px;">
                  <h5 class="mb-0">${review.user ? review.user : "Anonymous User"}</h5>
                    <p class="mb-0">Created on: ${new Date(review.created).toLocaleDateString()}</p>
                    <div class="d-flex justify-content-center">
                        ${review.rating}
                    </div>
                </div>
            </div>
        `);
        return reviewCard;
    };


    const createHTMLElement = (htmlString) => {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    };

    const initializeCarousel = () => {
        $('.testimonial-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 3
                }
            }
        });
    };


    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };

    const renderErrorMessage = () => {
        const errorMessage = createHTMLElement(`
            <div class="error-message text-center">
                <p class="py-5 ">Unable to load reviews at the moment. Please try again later.</p>
            </div>
        `);
        reviewContainer.appendChild(errorMessage);
    };

    fetchAndRenderReviews();
});
