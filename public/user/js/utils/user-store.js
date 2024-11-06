// Update sort option text on click
document.querySelectorAll(".sort-by-dropdown a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default navigation for now

    // Get the sorting name and URL from the clicked link
    const sortName = this.getAttribute("data-sort-name");
    const sortUrl = this.getAttribute("href");

    // Update the displayed sort option text
    document.getElementById("selected-sort-option").innerHTML = `
      ${sortName} <i class="fi-rs-angle-small-down"></i>
    `;

    // Navigate to the URL to apply the sort
    window.location.href = sortUrl;
  });
});

// Update the selected sort option based on URL parameter on page load
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sortParam = urlParams.get("sort");

  // Define mapping of URL params to display names
  const sortOptions = {
    featured: "Featured",
    priceAsc: "Price: Low to High",
    priceDesc: "Price: High to Low",
    releaseDate: "Release Date",
    rating: "Rating",
  };

  // If the sort parameter exists, update the display text accordingly
  if (sortParam && sortOptions[sortParam]) {
    document.getElementById("selected-sort-option").innerHTML = `
      ${sortOptions[sortParam]} <i class="fi-rs-angle-small-down"></i>
    `;
  }
});
