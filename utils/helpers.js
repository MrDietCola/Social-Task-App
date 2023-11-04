module.exports = {
  format_date: (currentDate) => {
    // Format the date as "month day, year"
    const date = new Date(currentDate);

    // Get the month, day, and year
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  },

  format_amount: (amount) => {
    // format large numbers with commas
    return parseInt(amount).toLocaleString();
  },
  get_emoji: () => {
    const randomNum = Math.random();

    // Return a random emoji
    if (randomNum > 0.7) {
      return `<span for="img" aria-label="lightbulb">💡</span>`;
    } else if (randomNum > 0.4) {
      return `<span for="img" aria-label="laptop">💻</span>`;
    } else {
      return `<span for="img" aria-label="gear">⚙️</span>`;
    }
  },

  format_tag: (tags) => {
    tags = tags.map((tagObj) => tagObj.tag_name)
    if (tags.length < 1) {
      return "untagged";
    }
    return tags.join(", ");
  },

  ifeq: (a, b) => {
    return a == b;
  }, 

  and: (a,b) => a==b

};
