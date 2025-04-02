// select hotel name
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get("hotelId");

  if (hotelId) {
    fetch(
      `https://hotel-booking-website-backend.vercel.app/hotel/hotels/${hotelId}/`
    )
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("hotel-name").value = data.name;
      })
      .catch((error) => {
        console.error("Error fetching hotel details:", error);
        document.getElementById("hotel-name").value =
          "Error loading hotel information.";
      });
  } else {
    document.getElementById("hotel-name").value =
      "No hotel selected. Please choose a hotel to book.";
  }
});

const handleBook = (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);

  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    Swal.fire({
      icon: "error",
      title: "User not logged in",
      text: "User not found. Please log in.",
    }).then(() => {
      window.location.href = "login.html";
      return;
    });
  }

  const HotelId = urlParams.get("hotelId");
  const start_date = document.getElementById("start_date").value;
  const end_date = document.getElementById("end_date").value;
  const number_of_rooms = document.getElementById("number_of_rooms").value;
  const payment_method = document.getElementById("payment_method").value;
  // Get current date
  const currentDate = new Date().toISOString().split("T")[0];

  // Validate dates
  if (start_date < currentDate) {
    Swal.fire({
      icon: "error",
      title: "Invalid Start Date",
      text: "The start date cannot be earlier than today.",
    });
    return;
  }

  if (start_date > end_date) {
    Swal.fire({
      icon: "error",
      title: "Invalid End Date",
      text: "The end date cannot be earlier than the start date.",
    });
    return;
  }
  const formData = {
    hotel_id: parseInt(HotelId),
    start_date: start_date,
    end_date: end_date,
    number_of_rooms: parseInt(number_of_rooms),
    user_id: parseInt(user_id),
  };
  console.log(formData);

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
          text: "Hotel booked successfully.Check your email for more information.",
        }).then(() => {
          window.location.reload();
          // window.location.href='index.html';
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
        console.error("Error:", error);
      });
  } else if (payment_method === "sslcommerz") {
    fetch(
      "https://hotel-booking-website-backend.vercel.app/payment/payment-booking/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      }
    )
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
        console.error("Error initiating SSLCommerz payment:", error);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: "Failed to initiate SSLCommerz payment process.",
        });
      });
  }
};

// add review

const handleReview = (event) => {
  event.preventDefault();
  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    Swal.fire({
      icon: "error",
      title: "User not logged in",
      text: "User ID not found in localStorage. Please log in.",
    });
    window.location.href = "login.html";
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);

  const hotel_id = urlParams.get("hotelId");
  const body = document.getElementById("body").value;
  const rating = document.getElementById("rating").value;

  const formData = {
    body: body,
    rating: rating,
    hotel: parseInt(hotel_id),
    user: parseInt(user_id),
  };
  console.log(formData);

  fetch("https://hotel-booking-website-backend.vercel.app/hotel/review_add/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      if (!res.ok) {
        throw new error(`Failed to submit review.${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Your review was added successfully!",
      }).then(() => {
        window.location.reload();
      });
      console.log(data);
      console.log("Successfully create a review.");
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message.startsWith("Failed to fetch")
          ? "Failed to fetch. Network error occurred."
          : `Failed to submit review. `,
      });
      console.error("Error:", error);
    });
};
