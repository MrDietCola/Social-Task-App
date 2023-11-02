const search = async (event) => {
  event.preventDefault();
  const searchVal = document.querySelector('#search').value.trim();
  console.log(searchVal);
  

  if (searchVal) {
    const response = await fetch(`/search/${searchVal}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/search/${searchVal}`);
    } else {
      alert('no users or tags with that name');
    }
  }
};


document
  .getElementById('search-button')
  .addEventListener('click', search);