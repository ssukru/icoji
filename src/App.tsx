import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import emojis from "./constants/emojis";
import { ColorResult, TwitterPicker } from "react-color";
import { toPng } from "html-to-image";

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [emojiSize, setEmojiSize] = useState<
    "small" | "medium" | "large" | "x-large" | "xx-large"
  >("medium");
  const [bgColor, setBgColor] = useState<ColorResult | undefined>();

  const isBgColorCloseToWhite = useMemo(() => {
    if (!bgColor) return false;
    const grayScaled =
      0.2126 * bgColor.rgb.r + 0.7152 * bgColor.rgb.g + 0.0722 * bgColor.rgb.b;
    return grayScaled < 220 ? false : true;
  }, [bgColor]);

  const previewRef = useRef<HTMLDivElement>(null);

  const generateImage = async () => {
    const element = previewRef.current;
    if (!element) return;

    const dataUrl = await toPng(element, {
      canvasHeight: 512,
      canvasWidth: 512,
      quality: 1,
    });
    // download image
    const link = document.createElement("a");
    link.download = `icoji_${Date.now()}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="emoji-wrapper">
          {emojis.map((emoji, idx) => (
            <div
              key={`emoji - ${idx}`}
              className="emoji"
              onClick={() => setSelectedEmoji(emoji)}
            >
              {emoji}
            </div>
          ))}
        </div>
        <div className="preview-wrapper">
          <div
            ref={previewRef}
            className="preview-background"
            style={{
              backgroundColor: `rgb(${bgColor?.rgb.r},${bgColor?.rgb.g},${bgColor?.rgb.b})`,
            }}
          >
            <span className={`selected-emoji emoji-${emojiSize}`}>
              {selectedEmoji}
            </span>
          </div>
          <div className="emoji-size-button-wrapper">
            <button onClick={() => setEmojiSize("small")}>Small</button>
            <button onClick={() => setEmojiSize("medium")}>Medium</button>
            <button onClick={() => setEmojiSize("large")}>Large</button>
            <button onClick={() => setEmojiSize("x-large")}>X-Large</button>
            <button onClick={() => setEmojiSize("xx-large")}>XX-Large</button>
          </div>
          <div className="color-picker-wrapper">
            <TwitterPicker
              color={bgColor?.hex}
              onChangeComplete={(color) => setBgColor(color)}
              triangle="hide"
            />
          </div>
          <div className="button-wrapper">
            <button
              onClick={generateImage}
              style={{
                backgroundColor: `rgb(${bgColor?.rgb.r},${bgColor?.rgb.g},${bgColor?.rgb.b})`,
                color: isBgColorCloseToWhite ? "#1c1c1c" : "#fafafa",
              }}
            >
              Generate
            </button>
            <p>Output will be 512x512 px resolution.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
