import HttpRequest from "../../../helpers/http-request.js";
import { showToast } from "../../../helpers/toast.js";
const readlistButtons = document.querySelectorAll(".button-readlist");
const readlistCountElement = document.querySelector(".pro-count");

const updateReadlistCount = (success) => {
  // Safely update the count
  const currentCount = parseInt(readlistCountElement.textContent, 10);

  readlistCountElement.textContent = success
    ? currentCount + 1
    : currentCount - 1;
};

const heartIconAction = (button, success) => {
  const heartIcon = button?.querySelector("i");

  heartIcon?.classList.toggle("bi-heart-fill", success);
  heartIcon?.classList.toggle("bi-heart", !success);
};

const readlistAction = async (e) => {
  // Use `currentTarget` to refer to the button
  const button = e.currentTarget;
  const bookId = button.getAttribute("data-book-id");
  const data = { bookId };

  try {
    const apiClient = new HttpRequest("/");
    const {
      message,
      data: { heart },
    } = await apiClient.post("readlist", data);

    heartIconAction(button, heart);
    updateReadlistCount(heart);
    return showToast(message, heart, "center", "bottom");
  } catch (error) {
    console.error(`Error adding to/removing from readlist`);
    showToast(
      "An unexpected error occurred. Please try again.",
      false,
      "center",
      "top"
    );
    throw error;
  }
};

readlistButtons.forEach((button) => {
  button.addEventListener("click", readlistAction);
});

document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.getElementById("apply-filter");
  const clearFiltersButton = document.getElementById("clear-filters");
  const sortDropdown = document.querySelector(".sort-by-dropdown");
  const sortLinks = document.querySelectorAll(".sort-by-dropdown ul li a");
  const selectedSortOption = document.getElementById("selected-sort-option");

  // Helper to get current query parameters
  const getQueryParams = () => new URLSearchParams(window.location.search);

  // ----------------------------------------
  // Filter Functionality
  // ----------------------------------------

  // Retain filter selections from URL
  const queryParams = getQueryParams();

  // Helper to retain checkbox states
  function retainFilters(filterName) {
    const selectedFilters = queryParams.get(filterName)?.split(",") || [];
    selectedFilters.forEach((filterValue) => {
      const checkbox = document.querySelector(
        `input[name="${filterName}"][value="${filterValue}"]`
      );
      if (checkbox) checkbox.checked = true;
    });
  }

  // Retain selections for all filter types
  [
    "category",
    "subcategory",
    "price",
    "language",
    "authors",
    "publisher",
  ].forEach(retainFilters);

  // Handle filter button click
  filterButton.addEventListener("click", () => {
    const newQueryParams = new URLSearchParams();

    // Helper to gather selected filters
    function gatherFilters(filterName) {
      const selectedFilters = Array.from(
        document.querySelectorAll(`input[name="${filterName}"]:checked`)
      ).map((checkbox) => checkbox.value);

      if (selectedFilters.length > 0) {
        newQueryParams.append(filterName, selectedFilters.join(","));
      }
    }

    // Gather filters for all types
    [
      "category",
      "subcategory",
      "price",
      "language",
      "authors",
      "publisher",
    ].forEach(gatherFilters);

    // Preserve existing sort and page parameters
    const currentSort = queryParams.get("sort");
    const currentPage = queryParams.get("page");

    if (currentSort) {
      newQueryParams.append("sort", currentSort);
    }
    if (currentPage) {
      newQueryParams.append("page", currentPage);
    }

    // // Preserve existing sort parameter
    // const currentSort = queryParams.get("sort");
    // if (currentSort) {
    //   newQueryParams.append("sort", currentSort);
    // }

    // // Reset the page number to 1
    // newQueryParams.set("page", 1);

    // Redirect to the new URL with query parameters
    const baseUrl = window.location.origin + window.location.pathname;
    window.location.href = `${baseUrl}?${newQueryParams.toString()}`;
  });

  // ----------------------------------------
  // Clear Filter Functionality
  // ----------------------------------------

  clearFiltersButton.addEventListener("click", () => {
    const newQueryParams = new URLSearchParams();

    // Retain only the sort parameter (clear filters and page number)
    const currentSort = queryParams.get("sort");
    if (currentSort) {
      newQueryParams.append("sort", currentSort);
    }

    // Redirect to the new URL with only the sort parameter
    const baseUrl = window.location.origin + window.location.pathname;
    window.location.href = `${baseUrl}?${newQueryParams.toString()}`;
  });

  // ----------------------------------------
  // Sort Functionality
  // ----------------------------------------

  // Function to handle sort option selection
  const handleSortClick = (event) => {
    // Prevent default navigation behavior
    event.preventDefault();

    // Get `data-sort-name` for display
    const sortName = event.target.getAttribute("data-sort-name");
    // Get `href` attribute and extract the query string after `?`
    const sortQuery = event.target
      .getAttribute("href")
      .split("?")[1]
      .replace("sort=", "");

    // Retain existing query parameters, but replace or add the sort parameter
    const newQueryParams = getQueryParams();
    newQueryParams.set("sort", sortQuery);

    // Update the URL in the browser
    const baseUrl = window.location.origin + window.location.pathname;
    window.history.pushState(
      null,
      "",
      `${baseUrl}?${newQueryParams.toString()}`
    );

    selectedSortOption.innerHTML = `${sortName} <i class="fi-rs-angle-small-down"></i>`; // Update the dropdown text
    sortDropdown.classList.remove("visible"); // Collapse the dropdown after selection
    window.location.reload(); // Reload the page with the updated query parameters
  };

  // Add click event listeners to all sort links
  sortLinks.forEach((link) => {
    link.addEventListener("click", handleSortClick);
  });

  // ----------------------------------------
  // Retain Sort and Filters
  // ----------------------------------------

  const currentSort = queryParams.get("sort");
  if (currentSort) {
    // Find the corresponding link for the current sort value
    const activeLink = Array.from(sortLinks).find((link) =>
      link.getAttribute("href").includes(`sort=${currentSort}`)
    );

    if (activeLink) {
      const sortName = activeLink.getAttribute("data-sort-name");
      selectedSortOption.innerHTML = `${sortName} <i class="fi-rs-angle-small-down"></i>`;
    }
  }

  // Toggle dropdown visibility
  const sortByCover = document.querySelector(".sort-by-cover");
  sortByCover.addEventListener("click", () => {
    sortDropdown.classList.toggle("visible");
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", (event) => {
    if (!sortByCover.contains(event.target)) {
      sortDropdown.classList.remove("visible");
    }
  });
});
