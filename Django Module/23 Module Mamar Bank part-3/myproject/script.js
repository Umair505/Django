let videos;
let isSorted = false;

const handleCategories = async () => {
  const response = await fetch("https://openapi.programming-hero.com/api/videos/categories");
  const data = await response.json();
  const categories = data.data;
  displayCategories(categories);
};



const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categories-container");
  categories.forEach((singleCategory, index) => {
    const append_div = document.createElement('div');
    const button = document.createElement('button'); 
    button.textContent = singleCategory.category;
    button.classList.add('category-button');

    // Check if it's the first button
    if (index === 0) {
      button.classList.add('active');
    }

    button.onclick = () => {
      document.querySelectorAll('.category-button').forEach(button => {
        button.classList.remove('active');
      });
      button.classList.add('active');
      singleCategoriesLoad(singleCategory.category_id);
    };
    append_div.appendChild(button);
    categoriesContainer.appendChild(append_div); 
  });
};


const singleCategoriesLoad = async (categoryId) => {
  const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
  const data = await response.json();
  const categoryItem = data.data;
  videos = categoryItem;
  displaySingleCategory();
};

const totalViews = (value) => {
  let num = value.split('k')[0];
  let thousand = parseInt(num.split(".")[0]) * 1000;
  let hundred = parseInt(num.split(".")[1]) * 100;
  if (!hundred) hundred = 0;
  let totalViews = thousand + hundred;
  return totalViews;
};

const displaySingleCategory = () => {
  const singleCategoryContainer = document.getElementById("single-category-container");
  singleCategoryContainer.textContent = "";

  const isDataFound = document.getElementById("error-message");
  if (videos.length === 0) {
    isDataFound.classList.remove("hidden");
  } else {
    isDataFound.classList.add("hidden");
  }

  if (isSorted) {
    let sortItem = videos.sort((a, b) => {
      let f = totalViews(a.others.views);
      let snd = totalViews(b.others.views);
      if (f > snd) {
        return 1;
      } else {
        return -1;
      }
    });
    videos = sortItem.reverse();
  }

  videos.forEach((singleCategory) => {
    const totalSnd = singleCategory.others.posted_date;
    const h = Math.floor(totalSnd / 3600);
    const remsnd = totalSnd % 3600;
    const minute = Math.floor(remsnd / 60);
    const div = document.createElement('div');
    const isVerified = singleCategory.authors[0].verified ? '<img class="verified-icon w-5 h-auto" src="./icon/verify.png" alt="Verified">' : '';
    div.innerHTML = `
    <div class="card class="h-fit rounded-lg"">
      <!-- thumbnail -->
      <figure class="w-full min-h-[100px] h-full   sm:h-[200px] relative">
        <img class="thumbnail h-full w-full rounded-md" src="${singleCategory.thumbnail}" alt="${singleCategory.title}">
        <div class="absolute bottom-3 right-3 text-white text-xs bg-[#171717] p-0.5 rounded-md">
          <span>${h ? h + "hrs" : ""} ${minute ? minute + "min ago" : ""}</span>
        </div>
      </figure>
      
      <!-- information -->
      <div class=" flex card-body flex-row gap-x-5 py-3">
        <div>
          <img src=" ${singleCategory.authors[0].profile_picture}" alt="${singleCategory.authors[0].profile_name}"
            class="w-10 h-10 rounded-full">
        </div>
        <div>
          <h3 class="text-xl font-semibold">${singleCategory.title}</h3>
          <div class="flex items-center gap-x-2">
            <h4 class="text-gray-500 text-base">${singleCategory.authors[0].profile_name}</h4>
            ${isVerified}
          </div>
          <h4 class="text-gray-400">${singleCategory.others.views} views</h4>
        </div>
      </div>
    </div>

      `;
    singleCategoryContainer.appendChild(div);
  });
};

const sortByView = () => {
  isSorted = true;
  displaySingleCategory();
};

handleCategories();
singleCategoriesLoad('1000');

const handleBlog = () => {
  window.open('blog.html', '_blank');
};