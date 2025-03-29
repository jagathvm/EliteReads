import HttpRequest from "../../../helpers/http-request.js";
import { userAddressValidator } from "../validators/user-address-validator.js";
import { showToast } from "../../../helpers/toast.js";
import { handleRedirect, handleReload } from "../../../helpers/handleUrl.js";

const postUserAddressForm = document.getElementById("postUserAddressForm");
const editUserAddressForms = document.querySelectorAll(".edit-address-form");
const deleteUserAddressButtons = document.querySelectorAll(
  ".delete-address-btn"
);
const deleteUserAddressConfirmButton =
  document.getElementById("confirmDeleteBtn");

postUserAddressForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const isValid = await userAddressValidator.revalidate();
  if (!isValid)
    return showToast("Kindly fill in all fields to continue.", false, "center");

  const formData = new FormData(postUserAddressForm);
  const rawData = Object.fromEntries(formData);

  try {
    const apiClient = new HttpRequest("/profile");
    const { message, success } = await apiClient.post("/address", rawData);

    const toastMessage = Array.isArray(message) ? message[0] : message;
    showToast(toastMessage, success, "center");

    if (success) {
      handleRedirect("/profile/address");
    }
  } catch (error) {
    console.error(error);
  }
});

editUserAddressForms.forEach((form) => {
  form.dataset.initialData = JSON.stringify(
    Object.fromEntries(new FormData(form))
  );

  const validator = new JustValidate(form); // Initialize validation

  validator
    .addField('[name="name"]', [
      { rule: "required", errorMessage: "Name is required" },
      {
        rule: "minLength",
        value: 3,
        errorMessage: "Name must be at least 3 characters",
      },
    ])
    .addField('[name="phone"]', [
      { rule: "required", errorMessage: "Phone number is required" },
      {
        rule: "customRegexp",
        value: /^[6-9]\d{9}$/,
        errorMessage:
          "Phone number must be valid (10 digits starting with 6-9)",
      },
    ])
    .addField('[name="pincode"]', [
      { rule: "required", errorMessage: "Pincode is required" },
      { rule: "number", errorMessage: "Pincode must be a number" },
      { rule: "minLength", value: 6, errorMessage: "Pincode must be 6 digits" },
      { rule: "maxLength", value: 6, errorMessage: "Pincode must be 6 digits" },
    ])
    .addField('[name="locality"]', [
      { rule: "required", errorMessage: "Locality is required" },
    ])
    .addField('[name="street"]', [
      { rule: "required", errorMessage: "Street address is required" },
    ])
    .addField('[name="city"]', [
      { rule: "required", errorMessage: "City/District/Town is required" },
    ])
    .addField('[name="state"]', [
      { rule: "required", errorMessage: "State is required" },
    ])
    .addField('[name="address_type"]', [
      { rule: "required", errorMessage: "Address type is required" },
    ])
    // Optional fields should not be empty if entered
    .addField('[name="landmark"]', [
      {
        validator: (value) => value.trim() === "" || value.trim().length >= 3,
        errorMessage: "Landmark must be at least 3 characters",
      },
    ])
    .addField('[name="alt_phone"]', [
      {
        validator: (value) => value.trim() === "" || /^[6-9]\d{9}$/.test(value),
        errorMessage:
          "Alternate phone must be valid (10 digits starting with 6-9)",
      },
    ]);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Run validation first
    const isValid = await validator.revalidate();
    console.log(isValid);
    if (!isValid) return;

    // Retrieves the address ID from the form's data attribute.
    //  `dataset` automatically converts `data-address-id` to `addressId` (camelCase).
    const addressId = form.dataset.addressId;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData);
    // Get initial data
    const initialData = JSON.parse(form.dataset.initialData);

    // Compare data and get only changed fields
    const changedData = Object.fromEntries(
      Object.entries(rawData).filter(
        ([key, value]) => value !== initialData[key]
      )
    );

    // If no changes, stop execution
    if (Object.keys(changedData).length === 0) {
      showToast("No changes detected.", false, "center");
      return;
    }

    try {
      const apiClient = new HttpRequest("/profile/address");
      const { message, success } = await apiClient.patch(
        `/${addressId}`, // Send PATCH request
        changedData
      );

      const toastMessage = Array.isArray(message) ? message[0] : message;
      showToast(toastMessage, success, "center");

      if (success) {
        handleRedirect("/profile/address");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to update address. Please try again.", false, "center");
    }
  });
});

deleteUserAddressButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const addressId = button.getAttribute("data-address-id");

    // update deleteUserAddressConfirmButton's data-address-id
    deleteUserAddressConfirmButton.setAttribute("data-address-id", addressId);
  });
});

deleteUserAddressConfirmButton.addEventListener("click", async (e) => {
  const addressId =
    deleteUserAddressConfirmButton.getAttribute("data-address-id");

  try {
    const apiClient = new HttpRequest("/profile/address");
    const { message, success } = await apiClient.delete(`/${addressId}`);

    showToast(message, false, "center", "top");
    if (!success) return;

    handleReload();
  } catch (error) {
    console.error(`An error occured while deleting user address: ${error}`);
  }
});
