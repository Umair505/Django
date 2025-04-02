document.addEventListener('DOMContentLoaded',()=>{
   const url = 'https://hotel-booking-website-backend.vercel.app/hotel/hotels/';
   fetch(url)
   .then(res =>res.json())
   .then(data=>{
    display(data);
   })
   .catch(error=console.error('Error fetching data : ',error));
   function display(hotels){
    const TotalHotel = hotels.length;
    const TotalAvailableRoom  = hotels.reduce((sum,hotel)=>sum+hotel.available_room, 0) ;
    document.getElementById('total-hotels').textContent= TotalHotel;
    document.getElementById('total-available-rooms').textContent = TotalAvailableRoom;
   }
})



document.addEventListener('DOMContentLoaded',()=>{
   const url = 'https://hotel-booking-website-backend.vercel.app/user/allUser/';
   fetch(url)
   .then(res =>res.json())
   .then(data=>{
    display(data);
   })
   .catch(error=console.error('Error fetching data : ',error));
   function display(clients){
    const TotalClient = clients.length +1000;
   ;
    document.getElementById('total-clients').textContent= TotalClient;
   
   }
})