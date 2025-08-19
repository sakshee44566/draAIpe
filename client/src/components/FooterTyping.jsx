import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";

function FooterTyping() {
  const fullText = "AI\u00A0\u00A0\u00A0\u00A0\u00A0 is here to help";
  const [typedComplete, setTypedComplete] = useState(false);
  const [showDr, setShowDr] = useState(false);
  const [showPe, setShowPe] = useState(false);

  const onTypingComplete = () => {
    setTypedComplete(true);
    setShowDr(true);
    setTimeout(() => setShowPe(true), 400);
  };

  return (
    <footer
      style={{
        width: "100%",
        marginTop: 32,
        padding: "24px 0 12px 0",
        textAlign: "center",
        fontSize: 70,
        letterSpacing: 1.2,
        fontFamily: "inherit",
        fontWeight: 500,
        position: "relative",
        minHeight: 44,
        whiteSpace: "pre",
        color: "#000",
      }}
    >
      <span
        style={{
          opacity: showDr ? 1 : 0,
          transition: "opacity 0.8s",
          marginRight: 4,
          color: "#000",
        }}
      >
        dr
      </span>

      {!typedComplete ? (
        <TypeAnimation
          sequence={[fullText, onTypingComplete]}
          speed={20}
          cursor={true}
          repeat={0}
          style={{ whiteSpace: "pre", fontWeight: 500, letterSpacing: 1.2 }}
        />
      ) : (
        <span style={{ whiteSpace: "pre", fontWeight: 500, letterSpacing: 1.2 }}>
          <span style={{ color: "orange", fontWeight: 700, letterSpacing: 2 }}>
            AI
          </span>
          {"     is here to help"}
        </span>
      )}

      <span
        style={{
          position: "relative",
          left: showPe ? "-570px" : "-245px",
          opacity: showPe ? 1 : 0,
          transition: "opacity 0.8s",
          pointerEvents: "none",
          userSelect: "none",
          color: "#000",
        }}
      >
        pe
      </span>
    </footer>
  );
}

export default FooterTyping;
