document.addEventListener("DOMContentLoaded", function () {
  const updateCoverImage = document.getElementById("updateCoverImage");
  const coverImagePreviews = document.getElementById("coverImagePreviews");
  const newImagePreviews = document.getElementById("newImagePreviews");
  const removedImageUrlsInput = document.getElementById("removedImageUrls");

  // To store all selected files
  const accumulatedFiles = new DataTransfer();

  // Handle existing images
  coverImagePreviews.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-preview-image")) {
      const imgElement = event.target.previousElementSibling;
      const imageUrl = imgElement.src;
      const removedImageUrls = JSON.parse(removedImageUrlsInput.value || "[]");

      removedImageUrls.push(imageUrl);
      removedImageUrlsInput.value = JSON.stringify(removedImageUrls);

      event.target.parentElement.remove();
      updateCoverImage.focus();
    }
  });

  // Handle new image uploads
  updateCoverImage.addEventListener("change", function () {
    const files = Array.from(updateCoverImage.files);

    files.forEach((file) => {
      accumulatedFiles.items.add(file); // Add each new file to accumulatedFiles
      const reader = new FileReader();

      reader.onload = function (e) {
        const colDiv = document.createElement("div");
        colDiv.classList.add(
          "position-relative",
          "me-2",
          "mb-2",
          "preview-container"
        );

        const img = document.createElement("img");
        img.src = e.target.result;
        img.classList.add("img-fluid", "preview-image");
        img.style.height = "200px";
        img.style.objectFit = "contain";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.classList.add(
          "btn",
          "btn-link",
          "text-danger",
          "text-decoration-none",
          "p-0",
          "remove-preview-image"
        );
        removeBtn.innerHTML = "&times;";
        removeBtn.title = "Remove this image";

        removeBtn.addEventListener("click", function () {
          const indexToRemove = Array.from(accumulatedFiles.files).findIndex(
            (f) => f === file
          );
          accumulatedFiles.items.remove(indexToRemove); // Remove file from accumulatedFiles
          colDiv.remove(); // Remove the preview
          updateCoverImage.files = accumulatedFiles.files; // Update input files
        });

        colDiv.appendChild(img);
        colDiv.appendChild(removeBtn);
        newImagePreviews.appendChild(colDiv);
      };

      reader.readAsDataURL(file);
    });

    // Update the file input to contain all accumulated files
    updateCoverImage.files = accumulatedFiles.files;
  });
});
