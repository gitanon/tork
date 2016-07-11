(function () {
  
  var x = document.querySelector('.trigger');

  x.addEventListener('click',function (e) {
    this.parentElement.classList.toggle('menu_active');
  });
  
}());