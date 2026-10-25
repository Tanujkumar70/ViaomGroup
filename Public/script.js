
const form = document.getElementById("enquiry-form");
const statusBox = document.getElementById("form-status");
const submitButton = form.querySelector('button[type="submit"]');
const submitText = document.getElementById("submit-text");

document.getElementById("year").textContent =
  new Date().getFullYear();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  statusBox.textContent = "";
  statusBox.className = "form-status";
  submitButton.disabled = true;
  submitText.textContent = "Submitting...";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Unable to submit your enquiry."
      );
    }

    statusBox.textContent = result.message;
    statusBox.classList.add("success");
    form.reset();
  } catch (error) {
    statusBox.textContent =
      error.message ||
      "Something went wrong. Please try again or contact us by email.";
    statusBox.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitText.textContent = "Submit Enquiry ↗";
  }
});
