// function loadDestination(url, container) {
//   fetch(url)
//     .then(response => response.text())
//     .then(html => {
//       container.innerHTML = html;
//     })
//     .catch(error => {
//       console.error('Error loading content:', error);
//     });
// }

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modal-body");
  const span = document.getElementsByClassName("close")[0];

  // Function to load content and display the modal
  function loadDestination(url, container) {
      fetch(url)
          .then(response => response.text())
          .then(html => {
              container.innerHTML = html;
              modal.style.display = "block";
          })
          .catch(error => {
              console.error('Error loading content:', error);
          });
  }

  // Close the modal when the user clicks on <span> (x)
  span.onclick = function() {
      modal.style.display = "none";
  }

  // Close the modal when the user clicks anywhere outside of the modal
  window.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  }

  // Add event listeners to "Learn More" buttons
  document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', function(event) {
          const country = event.target.closest('.card').querySelector('h2').innerText.toLowerCase();
          loadDestination(`./countries/${country}.html`, modalContent);
      });
  });

  // Dark mode toggle logic
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeLabel = darkModeToggle.parentElement;

  darkModeLabel.addEventListener('change', (event) => {
    const darkModeEvent = new CustomEvent('darkmode:toggle', {
      detail: { checked: event.target.checked },
      bubbles: true,
      cancelable: true
    });
    event.stopPropagation();
    event.currentTarget.dispatchEvent(darkModeEvent);
  });

  document.body.addEventListener('darkmode:toggle', (event) => {
    if (event.detail.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
  
});
