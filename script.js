const imagesWrapper=document.querySelector(".images");
const loadMoreBtn=document.querySelector(".load-more");
const searchInput=document.querySelector(".search-box input");
const lightBox=document.querySelector(".lightbox");
const closeBtn=lightBox.querySelector(".uil-times");
const downloadImgBtn=lightBox.querySelector(".uil-import");




//API key,paginations,searchTerm variables
const apiKey="tl9UvAMFEROaYZHyhMnDiIUpP0WcJPjoLnEX8ExiKfviWyBMtVO8Jrw8";
const perPage=15;
let currentPage=1;
let searchTerm= null;

const downloadImg = (imgURL) => {
	// Converting received img to blob, creating its download link, & downloading it  
	fetch(imgURL).then(res => res.blob()).then(file => {
	const a = document.createElement("a");
	a.href = URL.createObjectURL(file);
	a.download = new Date().getTime();
	a.click();
	}).catch(() => alert("Failed to download image!"));	

}

const showLightbox = (name,img) =>{
	//showing lightbox and setting image source and name and butn attribute
	lightBox.querySelector("img").src=img;
	lightBox.querySelector("span").innerText=name;
	downloadImgBtn.setAttribute("data-img",img);
	lightBox.classList.add("show");
	document.body.style.overflow = "hidden";
}
const hideLightbox = () =>{
	lightBox.classList.remove("show");
	document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
	// Making li of all fetched images and adding them to the existing image wrapper
	imagesWrapper.innerHTML += images.map(img => 
	  `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
		<img src="${img.src.large2x}" alt="img">
		<div class="details">
			<div class="photographer">
			<i class="uil uil-camera"></i>
			<span>${img.photographer}</span>
		</div>
		<button onclick="downloadImg('${img.src.large2x}');event.stopPropogation();">
			<i class="uil uil-import"></i>
		</button>
		</div>
	  </li>`

	).join("");
}


const getImages=(apiURL)=>{
	//fetching images by API call with authorization header
	loadMoreBtn.innerText="Loading...";
	loadMoreBtn.classList.add("disabled");
		fetch(apiURL,{
		headers:{Authorization: apiKey}
	}).then(res => res.json()).then(data => {
	generateHTML(data.photos);
	loadMoreBtn.innerText="Load More";
	loadMoreBtn.classList.remove("disabled");
	}).catch(() => alert("Failed to load images!"));
}
const loadMoreImages = () => {
	currentPage++;//Increment currentPage by 1
	//if searchterm has some value then call API with search term else call default API
	let apiURL =`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
	apiURL=searchTerm ?`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`:apiURL;
	getImages(apiURL);
}
const loadSearchImages = (e) => {
	//if the search input is empty,set the search term to null and return from here
	if(e.target.value=="") return searchTerm=null;
	//If pressed key is enter ,update the current page, search term & call the getImages
	if(e.key == "Enter"){
	currentPage = 1;
	searchTerm = e.target.value;
	imagesWrapper.innerHTML = "";
	getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
}
}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click",loadMoreImages);
searchInput.addEventListener("keyup",loadSearchImages);
closeBtn.addEventListener("click",hideLightbox);
downloadImgBtn.addEventListener("click",(e) => downloadImg(e.target
	.dataset.img
));
