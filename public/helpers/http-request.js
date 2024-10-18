class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async httpRequest(url, method = "GET", data = null, options = {}) {
    const config = {
      method,
      headers: {
        ...options.headers,
      },
    };

    if (method !== "GET" && data) {
      // Check if data is FormData
      if (data instanceof FormData) {
        config.body = data;
      } else {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(data);
      }
    }

    try {
      const fullUrl = `${this.baseUrl}${url}`;
      const response = await fetch(fullUrl, config);

      if (response.status === 204) {
        return {
          success: true,
          status: response.status,
          message: "No Content",
        };
      }

      if (response.status === 201) {
        const result = await response.json();
        return {
          success: true,
          message: result.message,
          data: result.data || null,
        };
      }

      if (response.status === 401 || response.status === 403) {
        window.location.href = "/api/auth/login";
        const result = await response.json();
        return {
          success: false,
          message: result.message,
        };
      }

      if (response.ok) {
        // If the response is successful, return an object with success set to true
        const result = await response.json();
        return {
          success: true,
          status: response.status,
          message: result.message,
          // Include data if the response contains any
          data: result.data || null,
        };
      }

      // Attempt to parse JSON, handle parsing errors
      let result = {};
      try {
        result = await response.json();
      } catch (error) {
        console.error(`Error parsing JSON: ${error}`);
      }

      return {
        success: false,
        status: response.status,
        message: result.message || result.errors.join("\n"),
      };
    } catch (error) {
      // Catch any network errors or unexpected issues
      return {
        success: false,
        message:
          error.message ||
          "An unexpected error occurred. Please try again later",
        error,
      };
    }
  }

  async get(url, options = {}) {
    return await this.httpRequest(url, "GET", null, options);
  }

  async post(url, data, options = {}) {
    return await this.httpRequest(url, "POST", data, options);
  }

  async patch(url, data, options = {}) {
    return await this.httpRequest(url, "PATCH", data, options);
  }

  async put(url, data, options = {}) {
    return await this.httpRequest(url, "PUT", data, options);
  }

  async delete(url, data, options = {}) {
    return await this.httpRequest(url, "DELETE", null, options);
  }
}

export default HttpRequest;
