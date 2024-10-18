document.addEventListener('DOMContentLoaded', function () {
  const editCoverImage = document.getElementById('editCoverImage');
  const editBookForm = document.getElementById('editBookForm');
  const coverImagePreviews = document.getElementById(
    'coverImagePreviews'
  );
  const newImagePreviews = document.getElementById(
    'newImagePreviews'
  );
  const removedImageUrlsInput = document.createElement('input');
  removedImageUrlsInput.type = 'hidden';
  removedImageUrlsInput.name = 'removedImageUrls';
  removedImageUrlsInput.value = '';
  editBookForm.appendChild(removedImageUrlsInput);

  const removedImageUrls = [];

  // Handle existing images
  coverImagePreviews.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-preview-image')) {
      const index = event.target.dataset.index;

      // Get the URL of the image to remove
      const imgElement = event.target.previousElementSibling;
      const imageUrl = imgElement.src;

      // Add the URL to the removedImageUrls array
      removedImageUrls.push(imageUrl);

      // Update the hidden input field with the removed URLs
      removedImageUrlsInput.value = JSON.stringify(removedImageUrls);

      // Remove the image preview from the UI
      event.target.parentElement.remove();
    }
  });

  // Handle new image uploads
  editCoverImage.addEventListener('change', function (event) {
    const files = Array.from(event.target.files);

    files.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const colDiv = document.createElement('div');
        colDiv.classList.add(
          'position-relative',
          'me-2',
          'mb-2',
          'preview-container'
        );

        const img = document.createElement('img');
        img.src = e.target.result;
        img.classList.add('img-fluid', 'preview-image');
        img.style.height = '100px';
        img.style.objectFit = 'cover';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.classList.add(
          'btn',
          'btn-link',
          'text-danger',
          'text-decoration-none',
          'p-0',
          'remove-preview-image'
        );
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remove this image';
        removeBtn.dataset.index = index;

        removeBtn.addEventListener('click', function () {
          // Remove the image preview from the UI
          colDiv.remove();

          // Remove the file from the input
          const newFileList = Array.from(editCoverImage.files).filter(
            (_, i) => i !== index
          );
          const dataTransfer = new DataTransfer();
          newFileList.forEach((file) => dataTransfer.items.add(file));
          editCoverImage.files = dataTransfer.files;

          // Update the label text
          updateLabelText();
        });

        colDiv.appendChild(img);
        colDiv.appendChild(removeBtn);
        newImagePreviews.appendChild(colDiv);
      };

      reader.readAsDataURL(file);
    });
  });
});
