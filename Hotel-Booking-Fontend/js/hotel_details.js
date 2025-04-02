// Show the spinner initially
document.getElementById("spinner").style.display = "flex";

// Get hotel ID from URL
const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get("id");

if (!hotelId) {
  console.error("Hotel ID not found in URL");
  // Hide the spinner and show an error message
  document.getElementById("spinner").style.display = "none";
  document.getElementById("content").innerHTML = "<p>Hotel ID not found.</p>";
} else {
  const apiURL = `https://hotel-booking-website-backend.vercel.app/hotel/hotels/${hotelId}/`;

  async function fetchHotelData() {
    try {
      const response = await fetch(apiURL);

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const hotel = await response.json();

      // Inject hotel data into HTML
      document.getElementById("hotelImage").src =
        hotel.photo || "default-image.jpg";
      document.getElementById("hotelName").innerText = hotel.name || "N/A";
      document.getElementById("hotelAddress").innerText =
        hotel.address || "N/A";
      document.getElementById("hotelPrice").innerText = `$${
        hotel.price_per_night || "0.00"
      }`;
      document.getElementById("hotelDescription").innerText =
        hotel.description || "No description available.";

      // Check hotel availability
      if (hotel.available_room > 0) {
        document.getElementById("hotelAvailability").innerText = "In stock";
        document
          .getElementById("hotelAvailability")
          .classList.add("text-success");
      } else {
        document.getElementById("hotelAvailability").innerText = "Out of stock";
        document
          .getElementById("hotelAvailability")
          .classList.remove("text-success");
        document
          .getElementById("hotelAvailability")
          .classList.add("text-danger");
      }

      // Hide the spinner and show content
      document.getElementById("spinner").style.display = "none";
      document.getElementById("content").style.display = "block";
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      // Hide the spinner and show an error message
      document.getElementById("spinner").style.display = "none";
      document.getElementById(
        "content"
      ).innerHTML = `<p>Error loading hotel data: ${error.message}</p>`;
    }
  }

  // Call the function to fetch and display hotel data
  fetchHotelData();
}

// Function to change the main hotel image when clicking a thumbnail
function changeImage(thumbnail) {
  const mainImage = document.getElementById("hotelImage");
  mainImage.src = thumbnail.src;
}

// recommended hotel

const similarHotelsContainer = document.getElementById("similarItems");

const apiURL = "https://hotel-booking-website-backend.vercel.app/hotel/hotels/";

async function fetchHotels() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    const hotels = data.results; // Get the list of hotels

    displayHotels(hotels); // Display the hotels
  } catch (error) {
    console.error("Error fetching hotel data:", error);
  }
}

// Function to generate and display hotel images, names, prices, and View Details button
function displayHotels(hotels) {
  let html = ""; // To hold the generated HTML

  hotels.forEach((hotel) => {
    html += `
      <div class="d-flex mb-3">
        <a href="#" class="me-3">
          <img
            src="${hotel.photo}"
            alt="${hotel.name}"
            style="min-width: 96px; height: 96px"
            class="img-md img-thumbnail"
            data-hotel-id="${hotel.id}"
          />
        </a>
        <div class="info">
          <a href="#" class="nav-link mb-1 view-detail-button" data-hotel-id="${
            hotel.id
          }">
            <strong>${hotel.name}</strong>
          </a>
          <p class="text-dark">Price: $${parseFloat(
            hotel.price_per_night
          ).toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  // Inject the HTML into the similar items container
  similarHotelsContainer.innerHTML = html;

  // Add event listeners to all "View Details" buttons
  addViewDetailListeners();
}

// Function to add event listeners for "View Details" buttons
function addViewDetailListeners() {
  // Get all "View Detail" buttons
  const viewDetailButtons = document.querySelectorAll(".view-detail-button");
  viewDetailButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const hotelId = this.getAttribute("data-hotel-id");
      window.location.href = `/hotel_details.html?id=${hotelId}`;
    });
  });
}

// Call the function to fetch and display the hotels
fetchHotels();

// -------------------------------------------------------------------------------------------------------------------------------------------


// Get token and user_id from localStorage
const token = localStorage.getItem("token");
const userId = localStorage.getItem("user_id");

const handleBook = (event) => {
  event.preventDefault();
  
  // Ensure user is logged in
  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "User not logged in",
      text: "User not found. Please log in.",
    }).then(() => {
      window.location.href = "login.html";
      return;
    });
  }

  // Get form values
  const start_date = document.getElementById("start_date").value;
  const end_date = document.getElementById("end_date").value;
  const number_of_rooms = document.getElementById("number_of_rooms").value;
  const payment_method = document.getElementById("payment_method").value;

  // Get today's date
  const currentDate = new Date().toISOString().split("T")[0];

  // Validate start date is not before today
  if (start_date < currentDate) {
    Swal.fire({
      icon: "error",
      title: "Invalid Start Date",
      text: "The start date cannot be earlier than today.",
    });
    return;
  }

  // Validate start date is not after end date
  if (start_date > end_date) {
    Swal.fire({
      icon: "error",
      title: "Invalid End Date",
      text: "The end date cannot be earlier than the start date.",
    });
    return;
  }

  // Prepare the form data
  const formData = {
    hotel_id: parseInt(hotelId),
    start_date: start_date,
    end_date: end_date,
    number_of_rooms: parseInt(number_of_rooms),
    user_id: parseInt(userId),
  };

  // Book hotel based on selected payment method
  if (payment_method === "account") {
    fetch("https://hotel-booking-website-backend.vercel.app/hotel/book/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(JSON.stringify(errorData));
          });
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Congratulations🎉",
          text: "Hotel booked successfully. Check your email for more information.",
        }).then(() => {
          window.location.reload();
        });
        console.log(data);
      })
      .catch((error) => {
        // Parse the error message
        let errorMessage = "Failed to book hotel.";
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.error) {
            errorMessage = errorData.error;
          } else {
            errorMessage = Object.values(errorData).join(" ");
          }
        } catch (e) {
          console.error("Error parsing error message:", e);
        }
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: errorMessage,
        });
      });
  } else if (payment_method === "sslcommerz") {
    fetch("https://hotel-booking-website-backend.vercel.app/payment/payment-booking/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "Failed to initiate SSLCommerz payment process.",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: "Failed to initiate SSLCommerz payment process.",
        });
      });
  }
};
