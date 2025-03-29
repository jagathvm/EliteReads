import { randomUUID } from "crypto";

export const sanitizePostAddress = (address) => {
  return {
    _id: randomUUID(), // Generate a unique ID
    name: address.name.trim().replace(/[^a-zA-Z\s]/g, ""),
    phone: address.phone.trim().replace(/\D/g, "").slice(0, 10),
    // Keep only digits, max 10
    pincode: address.pincode.trim().replace(/\D/g, "").slice(0, 6),
    // Keep only digits, max 6
    locality: address.locality.trim().replace(/[^a-zA-Z0-9\s]/g, ""),
    street: address.street.trim().replace(/[^a-zA-Z0-9\s,()\-]/g, ""),
    city: address.city.trim().replace(/[^a-zA-Z\s]/g, ""),
    state: address.state.trim().replace(/[^a-zA-Z\s]/g, ""),
    landmark: address.landmark.trim().replace(/[^a-zA-Z0-9\s]/g, ""),
    alt_phone: address.alt_phone.trim().replace(/\D/g, "").slice(0, 10),
    address_type: address.address_type,
  };
};

export const sanitizeEditAddress = (address) => {
  const sanitizedAddress = {};

  if (address.name) {
    sanitizedAddress.name = address.name.trim().replace(/[^a-zA-Z\s]/g, "");
  }
  if (address.phone) {
    sanitizedAddress.phone = address.phone
      .trim()
      .replace(/\D/g, "")
      .slice(0, 10);
  }
  if (address.pincode) {
    sanitizedAddress.pincode = address.pincode
      .trim()
      .replace(/\D/g, "")
      .slice(0, 6);
  }
  if (address.locality) {
    sanitizedAddress.locality = address.locality
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "");
  }
  if (address.street) {
    sanitizedAddress.street = address.street
      .trim()
      .replace(/[^a-zA-Z0-9\s,()\-]/g, "");
  }
  if (address.city) {
    sanitizedAddress.city = address.city.trim().replace(/[^a-zA-Z\s]/g, "");
  }
  if (address.state) {
    sanitizedAddress.state = address.state.trim().replace(/[^a-zA-Z\s]/g, "");
  }
  if (address.landmark) {
    sanitizedAddress.landmark = address.landmark
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "");
  }
  if (address.alt_phone) {
    sanitizedAddress.alt_phone = address.alt_phone
      .trim()
      .replace(/\D/g, "")
      .slice(0, 10);
  }
  if (address.address_type) {
    sanitizedAddress.address_type = address.address_type;
  }

  return sanitizedAddress;
};
