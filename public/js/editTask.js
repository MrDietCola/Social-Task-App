const newTaskHandler = async (event) => {
  event.preventDefault();
  console.log('clicked');
  const title = document.getElementById('task-title-input').value.trim();
  const body = document.getElementById('task-body-input').value.trim();
  const state = document.getElementById('task-state-input').value.trim();
  const visibility = document.getElementById('task-visibility-input').checked;
  const id = document.getElementById('id').getAttribute('data-id');

  console.log(title, body, state, visibility, id);
  if (title && body && state) {
    const response = await fetch(`/api/tasks/`, {
      method: 'PUT',
      body: JSON.stringify({
        title: title,
        description: body,
        state: state,
        public: visibility,
        id: id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace('/tasks');
    } else {
      alert('Failed to create task');
    }
  }
};

document.getElementById('button').addEventListener('click', newTaskHandler);