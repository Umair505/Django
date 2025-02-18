let allProducts = [];

const loadAllProduct = () => {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json => {
            allProducts = json;
            displayAllProduct(json);
        })
}

const displayAllProduct = (products) => {
            const parent = document.getElementById('all-products');
            parent.innerHTML = '';
            products.forEach(product => {
                const div = document.createElement('div');
                div.classList.add('product-card');
                const categoryHTML = product.category ? `<a>${product.category}</a>` : '';

                div.innerHTML = `
                    <div class="card m-2 text-center" style="width: 20rem;">
                        <img src="${product?.image}" class="card-img-top m-auto" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${product?.title.slice(0, 24)}...</h5>
                            <p class="card-text">${product?.description.slice(0, 90)}...</p>
                            <h3 class="card-title">$${product?.price}</h3>
                            <p><small class="category-style ">${categoryHTML}</small></p>
                            <a href="single_product.html?productId=${product.id}" class="btn btn-primary justify-content-center">View Details</a>
                        </div>
                    </div>
                `;
                parent.appendChild(div);
            });
        }


const loadCategory = () => {
    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(json => displayAllCategory(json))

}

const displayAllCategory = (categories) => {
    const parent = document.getElementById('show-cat');
    parent.innerHTML = '';

    const allList = document.createElement('li');
    allList.innerHTML = '<a>All</a>';
    allList.classList.add('category-item');
    allList.addEventListener('click', () => displayAllProduct(allProducts));
    parent.appendChild(allList);

    categories.forEach(category => {
        const li = document.createElement('li');
        li.classList.add('category-item');
        li.innerHTML = `
           <a> ${category.charAt(0).toUpperCase() + category.slice(1)}</a>`;
        li.addEventListener('click', () => {
            const filterProducts = allProducts.filter(product => product.category === category);
            displayAllProduct(filterProducts);
        })
        parent.appendChild(li);
    })
}




const displaySingleProduct = (product) => {
    const parent = document.getElementById('single-products');
    parent.innerHTML = '';
    
    const div = document.createElement('div');
    div.classList.add('product-card');
    const categoryHTML = product.category ? `<a>${product.category}</a>` : '';

    div.innerHTML = `

    <div class="row gx-5" >
    <aside class="col-lg-6">
      <div class="border rounded-4 mb-3 d-flex justify-content-center">
       <img  class="rounded-4 fit w-50 m-auto" src=${product.image} />
      </div>
    </aside>
    <main class="col-lg-6">
      <div class="ps-lg-3">
        <h4 class="title text-dark">
        ${product.title}
        </h4>
        <div class="d-flex flex-row my-3">
          <div class="text-warning mb-1 me-2">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
            <span class="ms-1">
              4.5
            </span>
          </div>
          <span class="text-muted"><i class="fas fa-shopping-basket fa-sm mx-1"></i>154 orders</span>
          <span class="text-success ms-2">In stock</span>
        </div>

        <div class="mb-3">
          <span class="h5">$${product.price}</span>
          <span class="text-muted">/per Pice</span>
        </div>

        <p>
            ${product.description}
        </p>

        <hr />

      
        <a href="#" class="btn btn-warning shadow-0"> Buy now </a>
        <a href="#" class="btn btn-primary shadow-0"> <i class="me-1 fa fa-shopping-basket"></i> Add to cart </a>
        <a href="#" class="btn btn-light border border-secondary py-2 icon-hover px-3"> <i class="me-1 fa fa-heart fa-lg"></i> Save </a>
        </div>

        <div class="text-center pt-5">
        <a href="index.html" class="btn btn-primary shadow-0">  Back Home Page </a>

        </div>
    </main>
  </div>
`;
    parent.appendChild(div);
}







const loadSingleProduct = () => {
    const productId = new URLSearchParams(window.location.search).get('productId');
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(res => res.json())
        .then(json => displaySingleProduct(json))
        .catch(error => console.error('Error:', error)); 
}



// const displaySingleProduct = (product) => {
//     const parent = document.getElementById('all-products');
//     parent.innerHTML = '';
    
//     const div = document.createElement('div');
//     div.classList.add('product-card');
//     const categoryHTML = product.category ? `<a>${product.category}</a>` : '';

//     div.innerHTML = `
//         <div class="card m-2 text-center" style="width: 20rem;">
//             <img src=${product?.image} class="card-img-top  m-auto" alt="...">
//             <div class="card-body">
//                 <h5 class="card-title">${product?.title}</h5>
//                 <p class="card-text">${product?.description}</p>
//                 <h3 class="card-title">$${product?.price}</h3>
//                 <p><small class="category-style ">${categoryHTML}</small></p>
//                 <a href="index.html" class="btn btn-primary justify-content-center">Back to All Products</a>
//             </div>
//         </div>
//     `;
//     parent.appendChild(div);
// }



loadSingleProduct();
loadCategory();
loadAllProduct();
