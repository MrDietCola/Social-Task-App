const newTagHandler = async (event) => {
    event.preventDefault();

    const tag_name = document.getElementById('tag-name-input').value.trim();

    console.log(tag_name);
    if (tag_name) {
        const response = await fetch(`/api/tags`, {
            method: 'POST',
            body: JSON.stringify({
                tag_name
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            document.location.replace('/tasks');
        } else {
            alert('Failed to create tag');
        }
    }
};

document.querySelector('.new-tag-form').addEventListener('submit', newTagHandler);