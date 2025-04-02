document.addEventListener("DOMContentLoaded", () => {
  const reviewContainer = document.getElementById("reviews-container");
  const loadingSpinner = document.getElementById("loader");
  const carouselContainer = document.createElement("div");
  carouselContainer.className = "owl-carousel testimonial-carousel";

  reviewContainer.innerHTML = "";

  // Show the loading spinner
  function showLoadingSpinner() {
    loadingSpinner.style.display = "block";
  }

  // Hide the loading spinner
  function hideLoadingSpinner() {
    loadingSpinner.style.display = "none";
  }

  showLoadingSpinner();
  reviewContainer.style.display = "none";

  // Fetch the reviews from the API
  fetch("https://hotel-booking-website-backend.vercel.app/hotel/reviews/")
    .then((res) => res.json())
    .then((reviews) => {
      if (reviews.length > 0) {
        reviews.forEach((review) => {
          const reviewCard = document.createElement("div");
          reviewCard.className = "";
          const tr_body = truncateText(review.body, 110);

          reviewCard.innerHTML = `
                          <div class="testimonial-item shadow text-center rounded pb-4 mb-2 mt-2">
                              <div class="testimonial-comment bg-light rounded p-4">
                                  <h6>${review.hotel.name}</h6>    
                                  <p class="text-center mb-5">${tr_body}</p>
                              </div>
                              <div class="testimonial-img p-1">
                                  <img src="img/user.png" class="img-fluid rounded-circle" alt="Image">
                              </div>
                              <div style="margin-top: -35px;">
                                 <h5 class="mb-0">${
                                   review.user ? review.user : "Anonymous User"
                                 }</h5>
                                  <p class="mb-0">Created on: ${new Date(
                                    review.created
                                  ).toLocaleDateString()}</p>
                                  <div class="d-flex justify-content-center">
                                      ${review.rating}
                                  </div>
                              </div>
                          </div>
                      `;
          carouselContainer.appendChild(reviewCard);
        });

        // Hide spinner and show reviews
        hideLoadingSpinner();
        reviewContainer.style.display = "block";
        reviewContainer.appendChild(carouselContainer);

        // Initialize Owl Carousel
        $(".testimonial-carousel").owlCarousel({
          loop: true,
          margin: 10,
          nav: true,
          responsive: {
            0: {
              items: 1,
            },
            600: {
              items: 2,
            },
            1000: {
              items: 3,
            },
          },
        });
      } else {
        // Hide spinner and show message if no reviews are available
        hideLoadingSpinner();
        reviewContainer.innerHTML = `<p class="text-center">No reviews available at the moment.</p>`;
        reviewContainer.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error fetching the reviews:", error);
      // Hide spinner and show an error message
      hideLoadingSpinner();
      reviewContainer.innerHTML = `<p class="text-center">Error loading reviews. Please try again later.</p>`;
      reviewContainer.style.display = "block";
    });
});

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}
