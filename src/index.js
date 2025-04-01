let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch all toys and render them
  fetchToys();

  // Add event listener for form submission to create a new toy
  const form = document.querySelector(".add-toy-form");
  form.addEventListener("submit", createToy);
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => {
        renderToy(toy);
      });
    });
}

function renderToy(toy) {
  const toyCollection = document.querySelector("#toy-collection");

  const toyCard = document.createElement("div");
  toyCard.classList.add("card");

  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="like-btn-${toy.id}">Like ❤️</button>
  `;

  // Add event listener to the like button
  const likeButton = toyCard.querySelector(`#like-btn-${toy.id}`);
  likeButton.addEventListener("click", () => likeToy(toy.id, toy.likes));

  // Append the card to the toy collection
  toyCollection.appendChild(toyCard);
}

function createToy(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;
  const newToy = {
    name,
    image,
    likes: 0,
  };

  // POST request to create a new toy
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then((response) => response.json())
    .then((toy) => {
      renderToy(toy); // Render the newly added toy to the DOM
      event.target.reset(); // Clear the form
      document.querySelector(".container").style.display = "none"; // Hide the form
    });
}

function likeToy(toyId, currentLikes) {
  const newLikes = currentLikes + 1;

  // PATCH request to update the toy's likes
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: newLikes,
    }),
  })
    .then((response) => response.json())
    .then((updatedToy) => {
      const toyCard = document.querySelector(`#like-btn-${toyId}`).parentElement;
      toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}
