const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

const buildAndRedirectQuery = () => {
  const params = new URLSearchParams(window.location.search);

  const selectedCategory = categoryFilter?.value;
  const selectedSort = sortFilter?.value;

  // Update query params
  if (selectedCategory) {
    params.set("category", selectedCategory);
  } else {
    params.delete("category");
  }

  if (selectedSort) {
    params.set("sort", selectedSort);
  } else {
    params.delete("sort");
  }

  // Reset to first page on filter change
  // params.set("page", "1");

  // Redirect to updated query
  window.location.href = `${window.location.pathname}?${params.toString()}`;
};

categoryFilter?.addEventListener("change", buildAndRedirectQuery);
sortFilter?.addEventListener("change", buildAndRedirectQuery);
