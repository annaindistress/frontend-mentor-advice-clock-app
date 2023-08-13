const controlTheme = () => {
  const hour = new Date().getHours();
  console.log(hour);
  if (hour >= 5 && hour < 17) {
    document.documentElement.dataset.theme = 'day';
  } else {
    document.documentElement.dataset.theme = 'night';
  }
};

export default controlTheme;
