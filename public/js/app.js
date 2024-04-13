document.body.addEventListener("htmx:beforeSwap", function (evt) {
  if (evt.detail.xhr.status === 422 || evt.detail.xhr.status === 400) {
    evt.detail.shouldSwap = false;
    evt.detail.isError = true;
  }
});
