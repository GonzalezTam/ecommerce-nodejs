/* eslint-disable no-undef */
const checkoutButton = document.getElementById('order-checkout-button');
const cartId = document.getElementById('my-cart').getAttribute('data-cart-id');

checkoutButton.addEventListener('click', function (e) {
  if (cartId) checkProductAvailability(cartId);
}, false);

const checkProductAvailability = async (cartId) => {
  fetch(`http://localhost:3000/api/products/purchase/${cartId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        if (data.status === 404) throw new Error(data.error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: '<p>Cannot checkout, products not available. <br> Please remove them from your cart and try again.</p>'
        });
        return;
      }
      if (data.result) {
        let timerInterval;
        Swal.fire({
          title: 'Thank you for your purchase!',
          html: 'Your order has been submitted!',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {}, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        });
        submitOrder(data.result);
      }
    })
    .catch(err => console.error(err));
};

const submitOrder = async (order) => {
  fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) document.location.href = '/purchase/failed';
      if (data.result) document.location.href = '/purchase/success';
    });
};
