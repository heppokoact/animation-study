$(() => {
  let logArea = $("#boxTransitionLogArea");
  let log = e => {
    logArea.append(`<li>${e.type}, ${e.originalEvent.propertyName}</li>`);
  };
  $(".box").on("transitionstart", log);
  $(".box").on("transitionend", log);
});
