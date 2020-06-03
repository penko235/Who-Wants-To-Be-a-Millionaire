const finalScore = document.querySelector('#finalScore');

finalScore.textContent = `Congratulations You Won: ${localStorage.getItem(`score`)}`;
