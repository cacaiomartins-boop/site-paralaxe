import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export { jsonLd } from "./seo";

export function render() {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
