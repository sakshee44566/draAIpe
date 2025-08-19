
function Cart({ cart, setCart }) {
  const removeFromCart = (index) => {
    setCart(cart => cart.filter((_, i) => i !== index))
  }
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0)
  return (
    <div>
      <h2 style={{textAlign: 'left', marginBottom: '1.5rem'}}>Your Cart</h2>
      {cart.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <div>
          <div className="cart-list">
            {cart.map((item, i) => (  
              <div className="cart-item" key={i}>
                <img src={item.images} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹  {item.price}</div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(i)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-total-row">
            <span>Total:</span>
            <span className="cart-total">₹{total}</span>
          </div>
          <button className="checkout-btn">Checkout</button>
        </div>
      )}
    </div>
  )
}

export default Cart;