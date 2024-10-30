const coverImage = document.getElementById("book_cover_image");

coverImage.addEventListener("change", (event) => {
  const imagePreviewContainer = document.getElementById("imagePreview");

  // Clear previous previews
  imagePreviewContainer.innerHTML = "";
  // Convert FileList to array
  let files = Array.from(event.target.files);

  if (files.length > 0) {
    files.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col-md-3", "mb-3", "position-relative");
        // Adjust size of preview images
        colDiv.style.flex = "1 1 30%";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.classList.add("img-fluid");
        // Adjust height for larger preview
        img.style.height = "200px";
        img.style.objectFit = "contain";

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("position-absolute", "top-0", "end-0");
        removeBtn.innerHTML = "&times;";
        removeBtn.title = "Remove this image";
        removeBtn.style.border = "none";
        removeBtn.style.backgroundColor = "transparent";
        removeBtn.style.color = "red";
        removeBtn.style.fontSize = "2rem";
        removeBtn.style.lineHeight = "1";
        removeBtn.style.padding = "0";
        removeBtn.style.cursor = "pointer";

        removeBtn.addEventListener("click", () => {
          // Remove the file from the array
          files = files.filter((_, i) => i !== index);
          // Update the file input with remaining files
          updateFileInput(files);
          // Remove the preview element
          colDiv.remove();
        });

        colDiv.appendChild(img);
        colDiv.appendChild(removeBtn);
        imagePreviewContainer.appendChild(colDiv);
      };

      reader.readAsDataURL(file);
    });
  }
});

// Utility function to create a new FileList from an array of files
const updateFileInput = (files) => {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  coverImage.files = dataTransfer.files;
};
