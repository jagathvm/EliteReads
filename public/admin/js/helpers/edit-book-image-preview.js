document.addEventListener("DOMContentLoaded", function () {
  const editCoverImage = document.getElementById("editCoverImage");
  const coverImagePreviews = document.getElementById("coverImagePreviews");
  const newImagePreviews = document.getElementById("newImagePreviews");
  const removedImageUrlsInput = document.getElementById("removedImageUrls");

  const accumulatedFiles = new DataTransfer(); // To store all selected files

  // Handle existing images
  coverImagePreviews.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-preview-image")) {
      const imgElement = event.target.previousElementSibling;
      const imageUrl = imgElement.src;
      const removedImageUrls = JSON.parse(removedImageUrlsInput.value || "[]");

      removedImageUrls.push(imageUrl);
      removedImageUrlsInput.value = JSON.stringify(removedImageUrls);

      event.target.parentElement.remove();
      editCoverImage.hidden = false;
      editCoverImage.focus();
    }
  });

  // Handle new image uploads
  editCoverImage.addEventListener("change", function (event) {
    const files = Array.from(event.target.files);

    files.forEach((file, index) => {
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
        img.style.height = "100px";
        img.style.objectFit = "cover";

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
        removeBtn.dataset.index = index;

        removeBtn.addEventListener("click", function () {
          colDiv.remove();

          // Remove the file from accumulatedFiles
          accumulatedFiles.items.remove(index);
          editCoverImage.files = accumulatedFiles.files; // Update input files
        });

        colDiv.appendChild(img);
        colDiv.appendChild(removeBtn);
        newImagePreviews.appendChild(colDiv);
      };

      reader.readAsDataURL(file);
    });

    // Update the file input to contain all accumulated files
    editCoverImage.files = accumulatedFiles.files;
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   const editCoverImage = document.getElementById("editCoverImage");
//   const coverImagePreviews = document.getElementById("coverImagePreviews");
//   const newImagePreviews = document.getElementById("newImagePreviews");
//   const removedImageUrlsInput = document.getElementById("removedImageUrls");

//   // Handle existing images
//   coverImagePreviews.addEventListener("click", function (event) {
//     if (event.target.classList.contains("remove-preview-image")) {
//       // Get the URL of the image to remove
//       const imgElement = event.target.previousElementSibling;
//       const imageUrl = imgElement.src;
//       const removedImageUrls = [];

//       // Add the URL to the removedImageUrls array
//       removedImageUrls.push(imageUrl);

//       // Update the hidden input field with the removed URLs
//       removedImageUrlsInput.value = JSON.stringify(removedImageUrls);

//       // Remove the image preview from the UI
//       event.target.parentElement.remove();

//       // Display the file input button
//       editCoverImage.hidden = false;

//       // Focues the file input
//       editCoverImage.focus();
//     }
//   });

//   // Handle new image uploads
//   editCoverImage.addEventListener("change", function (event) {
//     const files = Array.from(event.target.files);

//     files.forEach((file, index) => {
//       const reader = new FileReader();

//       reader.onload = function (e) {
//         const colDiv = document.createElement("div");
//         colDiv.classList.add(
//           "position-relative",
//           "me-2",
//           "mb-2",
//           "preview-container"
//         );

//         const img = document.createElement("img");
//         img.src = e.target.result;
//         img.classList.add("img-fluid", "preview-image");
//         img.style.height = "100px";
//         img.style.objectFit = "cover";

//         const removeBtn = document.createElement("button");
//         removeBtn.type = "button";
//         removeBtn.classList.add(
//           "btn",
//           "btn-link",
//           "text-danger",
//           "text-decoration-none",
//           "p-0",
//           "remove-preview-image"
//         );
//         removeBtn.innerHTML = "&times;";
//         removeBtn.title = "Remove this image";
//         removeBtn.dataset.index = index;

//         removeBtn.addEventListener("click", function () {
//           // Remove the image preview from the UI
//           colDiv.remove();

//           // Remove the file from the input
//           const newFileList = Array.from(editCoverImage.files).filter(
//             (_, i) => i !== index
//           );
//           const dataTransfer = new DataTransfer();
//           newFileList.forEach((file) => dataTransfer.items.add(file));
//           editCoverImage.files = dataTransfer.files;

//           // Update the label text
//           updateLabelText();
//         });

//         colDiv.appendChild(img);
//         colDiv.appendChild(removeBtn);
//         newImagePreviews.appendChild(colDiv);
//       };

//       reader.readAsDataURL(file);
//     });
//   });
// });
