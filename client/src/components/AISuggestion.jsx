import { useState, useEffect } from "react";
import FooterTyping from "./FooterTyping";

function useTypingText(text, speed = 120) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

function AISuggestion() {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! I am your fashion AI. Ask me anything or upload a photo for suggestions.' }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latestProducts, setLatestProducts] = useState([]);
  const [productPage, setProductPage] = useState(1);

  const PRODUCTS_PER_PAGE = 10;
  const aiTyping = useTypingText("AI", 160);

  const totalProductPages = Math.ceil(latestProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = latestProducts.slice(
    (productPage - 1) * PRODUCTS_PER_PAGE,
    productPage * PRODUCTS_PER_PAGE
  );

  const handleSend = async () => {
    if (!input && !image) return;
    const userMsg = { from: 'user', text: input, image };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setImage(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('message', input);
      if (image) formData.append('image', image);
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setMessages(msgs => [...msgs, { from: 'ai', text: data.reply, products: data.products || [] }]);
      setLatestProducts(data.products || []);
      setProductPage(1); // Reset to first page when new suggestions arrive
    } catch (e) {
      setMessages(msgs => [...msgs, { from: 'ai', text: 'Sorry, there was an error.' }]);
      setLatestProducts([]);
    }
    setLoading(false);
  };

  const handleImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div className="ai-suggestion-container" style={{ flex: 1, maxWidth: 480 }}>
          <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>AI Fashion Suggestion</h2>
          <div className="chat-box" style={{ minHeight: 320 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.image && <img src={URL.createObjectURL(msg.image)} alt="upload" className="chat-img" />}
                <span>{msg.text}</span>
              </div>
            ))}
            {loading && <div className="chat-msg ai"><span>...</span></div>}
          </div>
          {image && (
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
              />
              <span style={{ fontSize: 13, color: '#555' }}>Image selected</span>
              <button
                onClick={() => setImage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d00',
                  fontSize: 18,
                  cursor: 'pointer',
                  marginLeft: 8
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}

          <div className="chat-input-row">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} id="img-upload" />
            <label htmlFor="img-upload" className="img-upload-btn">📷</label>
            <button onClick={handleSend} className="send-btn" disabled={loading || (!input && !image)}>Send</button>
          </div>
        </div>

        <div className="ai-product-suggestions" style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', height: 500 }}>
          <h3 style={{ marginBottom: '1rem' }}>AI Recommendations</h3>
          {latestProducts.length === 0 && (
            <div style={{ color: '#888' }}>No suggestions yet. Ask the AI for outfit ideas!</div>
          )}

          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            minHeight: 220
          }}>
            {paginatedProducts.map((product, idx) => (
              <div key={product._id || idx} className="ai-product-card" style={{ width: 120, marginBottom: 16 }}>
                <img
                  src={
                    typeof product.images === 'string'
                      ? product.images.split('~')[0].trim()
                      : Array.isArray(product.images)
                        ? product.images[0]
                        : ''
                  }
                  alt={product.title || product.name}
                  className="ai-product-img"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 4 }}
                />
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>
                  {product.title || product.name}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  ₹{product.price}
                </div>
              </div>
            ))}
          </div>

          {totalProductPages > 1 && (
            <div style={{
              marginTop: 0,
              padding: '12px 0 0 0',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 40
            }}>
              <button
                onClick={() => setProductPage(productPage - 1)}
                disabled={productPage === 1}
                style={{
                  marginRight: 12,
                  fontSize: 22,
                  background: 'none',
                  border: 'none',
                  cursor: productPage === 1 ? 'not-allowed' : 'pointer',
                  color: productPage === 1 ? '#ccc' : '#222'
                }}
                aria-label="Previous page"
              >
                ‹
              </button>
              <span style={{ fontSize: 15, minWidth: 80 }}>
                Page {productPage} of {totalProductPages}
              </span>
              <button
                onClick={() => setProductPage(productPage + 1)}
                disabled={productPage === totalProductPages}
                style={{
                  marginLeft: 12,
                  fontSize: 22,
                  background: 'none',
                  border: 'none',
                  cursor: productPage === totalProductPages ? 'not-allowed' : 'pointer',
                  color: productPage === totalProductPages ? '#ccc' : '#222'
                }}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
      <FooterTyping aiTyping={aiTyping} />
    </div>
  );
}

export default AISuggestion;
