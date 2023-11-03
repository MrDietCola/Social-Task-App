
const addFriend = async (event) => {
  event.preventDefault();

  const url = window.location.href.toString();
  const numberMatch = url.match(/\d+$/);
  const friend_id = parseInt(numberMatch[0], 10).toString();
  const user_id = event.target.getAttribute('data-user_id');

  if (friend_id && user_id) {
      // Send a POST request to the add friend
      const response = await fetch('/api/friends/', {
          method: 'POST',
          body: JSON.stringify({ friend_id, user_id }),
          headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
          // If successful, redirect the browser to the profile page
          const addButton = document.getElementById("add-friend");
          const paragraph = document.createElement("p");
          const username = event.target.getAttribute('data-username');
          paragraph.textContent = `${username} added to friends!`;
          paragraph.classList.add("add-friend");
          addButton.parentNode.replaceChild(paragraph, addButton);
      } else {
          alert(response);
          console.log(response);
      }
  }
};

document.getElementById('add-friend').addEventListener('click', addFriend);