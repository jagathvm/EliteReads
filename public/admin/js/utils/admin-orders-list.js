const statusSelect = document.getElementById("statusFilter");
const dateInput = document.getElementById("dateFilter");

const params = new URLSearchParams(window.location.search);

const statusParams = params.get("status");
const dateParams = params.get("date");

if (statusParams) {
  statusSelect.value = statusParams;
}

if (dateParams) {
  try {
    const d = new Date(dateParams);

    if (!isNaN(d)) {
      // Convert to yyyy-MM-dd for input type="date"
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  } catch (err) {
    console.error("Invalid date in query:", dateParams);
  }
}

const buildAndRedirectQuery = () => {
  // Get existing query params from current URL
  const currentParams = new URLSearchParams(window.location.search);

  const status = statusSelect.value;
  const rawDate = dateInput.value;

  const toISOStringWithOffset = (date) => {
    const pad = (num) => String(num).padStart(2, "0");

    const yyyy = date.getUTCFullYear();
    const mm = pad(date.getUTCMonth() + 1);
    const dd = pad(date.getUTCDate());
    const hh = pad(date.getUTCHours());
    const min = pad(date.getUTCMinutes());
    const ss = pad(date.getUTCSeconds());
    const ms = String(date.getUTCMilliseconds()).padStart(3, "0");

    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}.${ms}+00:00`;
  };

  if (status) {
    currentParams.set("status", status);
  } else {
    currentParams.delete("status");
  }

  if (rawDate) {
    const date = new Date(rawDate);

    if (!isNaN(date)) {
      currentParams.set("date", toISOStringWithOffset(date));
    }
  } else {
    currentParams.delete("date");
  }

  const queryString = currentParams.toString();
  const query = `/admin/orders${queryString ? "?" + queryString : ""}`;

  window.location.href = query;
};

statusSelect.addEventListener("change", buildAndRedirectQuery);
dateInput.addEventListener("change", buildAndRedirectQuery);
