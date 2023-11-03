// get tag val, get task val. Use task in api call, tag in body.
const linkHandler = async (event) => {
    event.preventDefault();
    const task_id = document.getElementById('link-new-tag').getAttribute('data-task-id');
    const tag_id = document.getElementById('link-tag-select').value.trim();

    console.log('task', task_id, 'tag', tag_id);
    if (task_id) {
        const response = await fetch(`/api/tasks/tag/${task_id}`, {
            method: 'POST',
            body: JSON.stringify({
                tag_id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            document.location.reload();
        } else {
            alert('Failed to add tag');
        }
    }
};

document.getElementById('link-new-tag').addEventListener('submit', linkHandler);