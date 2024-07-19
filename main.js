const showTwoLines = (button) => {
    const contentsLine = button.closest('.contents-line');
    const cardContainer = contentsLine.querySelector('.card-container');
    cardContainer.classList.toggle('card-two-lines');
  };