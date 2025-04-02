let total_hotel = 0;
let total_av = 231;
let total_user = 7;

// Function to fetch hotel data
function fetchHotelData(doughnutChart) {
  const url = "https://hotel-booking-website-backend.vercel.app/hotel/hotels/";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Update values based on fetched data
      total_hotel = data.length;
      total_av = data.reduce((sum, hotel) => sum + hotel.available_room, 0);

      // Update Doughnut Chart with new values
      doughnutChart.data.datasets[0].data[1] = total_hotel; // Hotels
      doughnutChart.data.datasets[0].data[3] = total_av; // Total Available Room
      doughnutChart.update();
    })
    .catch((error) => {
      console.error("Error fetching hotel data: ", error);
    });
}

// Function to fetch user data
function fetchUserData(doughnutChart) {
  const url = "https://hotel-booking-website-backend.vercel.app/user/allUser/";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Update total_user count with fetched data
      total_user = data.length; // Adjust based on your logic

      // Update Doughnut Chart with new total_user value
      doughnutChart.data.datasets[0].data[0] = total_user; // Users
      doughnutChart.update();
    })
    .catch((error) => {
      console.error("Error fetching user data: ", error);
    });
}

// Up-Down Line Chart
const upDownLineCtx = document
  .getElementById("upDownLineChart")
  .getContext("2d");

const upDownLineChart = new Chart(upDownLineCtx, {
  type: "line",
  data: {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Bookings",
        data: [10, 20, 15, 12, 25, 40, 35, 25, 34, 23, 40, 30],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Cancellations",
        data: [1, 2, 3, 1, 5, 2, 0, 1, 2, 0, 3, 2],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

document.addEventListener("DOMContentLoaded", async () => {
  // Initial dummy data values
  let totalClients = 5;
  let totalHotels = 25;
  let totalAvailableRooms = 265;
  let totalBookedRooms = 26;

  renderChart(totalClients, totalHotels, totalAvailableRooms, totalBookedRooms);

  try {
    const clientsResponse = await fetch(
      "https://hotel-booking-website-backend.vercel.app/user/allUser/"
    );
    const clients = await clientsResponse.json();
    totalClients = clients.length;
    document.getElementById("total-clients").textContent = totalClients;
    console.log("Total Clients:", totalClients);

    const hotelsResponse = await fetch(
      "https://hotel-booking-website-backend.vercel.app/hotel/hotels/"
    );
    const hotels = await hotelsResponse.json();
    totalHotels = hotels.count;
    totalAvailableRooms = hotels.results.reduce(
      (sum, hotel) => sum + hotel.available_room,
      0
    );
    document.getElementById("total-hotels").textContent = totalHotels;
    document.getElementById("total-available-rooms").textContent =
      totalAvailableRooms;
    console.log(
      "Total Hotels:",
      totalHotels,
      "Total Available Rooms:",
      totalAvailableRooms
    );

    const bookingsResponse = await fetch(
      "https://hotel-booking-website-backend.vercel.app/hotel/bookings/"
    );
    const bookings = await bookingsResponse.json();
    totalBookedRooms = bookings.reduce(
      (sum, booking) => sum + booking.number_of_rooms,
      0
    );
    document.getElementById("total-booked-room").textContent = totalBookedRooms;
    console.log("Total Booked Rooms:", totalBookedRooms);

    renderChart(
      totalClients,
      totalHotels,
      totalAvailableRooms,
      totalBookedRooms
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function renderChart(
  totalClients,
  totalHotels,
  totalAvailableRooms,
  totalBookedRooms
) {
  const ctx = document.getElementById("doughnutChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: [
        "Total Clients",
        "Total Hotels",
        "Available Rooms",
        "Booked Rooms",
      ],
      datasets: [
        {
          label: "Hotel Booking Data",
          data: [
            totalClients,
            totalHotels,
            totalAvailableRooms,
            totalBookedRooms,
          ],
          backgroundColor: ["#21BA87", "#B64EA0", "#66BF4D", "#F4373D"],
          borderColor: ["#FFFFFF"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}
