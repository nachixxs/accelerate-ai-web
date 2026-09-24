import React from "react";

export function GradientText({ children, as = "span", style, ...rest }) {
  return React.createElement(
    as,
    {
      "data-layer": "texto-gradiente",
      style: {
        background: "var(--gradient-text)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        ...style,
      },
      ...rest,
    },
    children
  );
}
