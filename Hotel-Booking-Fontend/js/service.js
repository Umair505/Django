
    document.addEventListener('DOMContentLoaded', () => {
        const reviewContainer = document.getElementById('reviews-container');
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'owl-carousel testimonial-carousel';
        reviewContainer.innerHTML = '';

        // Fetch the reviews from the API
        fetch('https://hotel-booking-website-backend.vercel.app/hotel/reviews/')
            .then(res => res.json())
            .then(reviews => {
                reviews.forEach(review => {
                    const reviewCard = document.createElement('div');
                    reviewCard.className = 'testimonial-item position-relative bg-white rounded overflow-hidden shadow text-center rounded pb-4';
                    const truncatedBody = truncateText(review.body, 110);
                    const createdDate = new Date(review.created).toLocaleDateString();

                    reviewCard.innerHTML = `
                        <div class="testimonial-item position-relative bg-white rounded overflow-hidden">
                            <div class="testimonial-comment bg-light rounded p-4">
                                <h5>${review.hotel.name}</h5>
                                <p class="text-center mb-5">${truncatedBody}</p>
                            </div>
                            <div class="testimonial-img p-1">
                                <img src="img/user.png" class="img-fluids rounded-circle" alt="Image" style="width: 85px; ">
                            </div>
                            <div class="ps-3" style="margin-top: -35px;">
                                <h6 class="fw-bold mb-1">${review.user}</h6>
                                <small>Created on: ${createdDate}</small>
                                <div class="d-flex justify-content-center">
                                    <span class="rating">${generateRatingStars(review.rating)}</span>
                                </div>
                            </div>
                            <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-1 mb-n1" style=" font-size: 39px; padding-right: 6px;" ></i>
                        </div>
                    `;
                    carouselContainer.appendChild(reviewCard);
                });
                reviewContainer.appendChild(carouselContainer);

                // Initialize the Owl Carousel 
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
            })
            .catch(error => {
                console.error('Error fetching the reviews:', error);
            });
    });

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    }

    function generateRatingStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fa fa-star${i <= rating ? '' : '-o'} text-warning"></i>`;
        }
        return stars;
    }

