(() => {
  "use strict";

  /*
   * SB_PASSWORD_VISIBILITY_R1
   * Shared password visibility for Admin + Client Portal.
   */

  const STYLE_ID =
    "sb-password-visibility-r1-styles";

  function addStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      STYLE_ID;

    style.textContent = `
      .sb-password-visibility-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        justify-self: start;

        margin-top: 7px;
        padding: 2px 0;

        border: 0;
        background: transparent;
        color: inherit;

        font: inherit;
        font-size: 12px;
        font-weight: 750;

        cursor: pointer;
        opacity: .78;
      }

      .sb-password-visibility-toggle:hover {
        opacity: 1;
        text-decoration: underline;
      }

      .sb-password-visibility-toggle:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 3px;
        border-radius: 4px;
        opacity: 1;
      }
    `;

    document.head.appendChild(
      style
    );
  }


  function setVisibility(
    input,
    button,
    visible
  ) {
    input.type =
      visible
        ? "text"
        : "password";

    button.textContent =
      visible
        ? "Sembunyikan password"
        : "Tampilkan password";

    button.setAttribute(
      "aria-pressed",
      visible
        ? "true"
        : "false"
    );
  }


  function enhance(input) {
    if (
      !(
        input instanceof
        HTMLInputElement
      ) ||
      input.type !== "password" ||
      input.dataset
        .sbPasswordVisibilityR1 ===
        "1"
    ) {
      return;
    }

    input.dataset
      .sbPasswordVisibilityR1 =
      "1";

    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "sb-password-visibility-toggle";

    button.textContent =
      "Tampilkan password";

    button.setAttribute(
      "aria-pressed",
      "false"
    );


    button.addEventListener(
      "click",
      () => {
        const visible =
          input.type ===
          "password";

        setVisibility(
          input,
          button,
          visible
        );

        try {
          input.focus({
            preventScroll: true
          });
        }
        catch {
          input.focus();
        }
      }
    );


    const parent =
      input.parentElement;

    if (
      parent &&
      parent.tagName ===
        "LABEL"
    ) {
      parent.insertAdjacentElement(
        "afterend",
        button
      );
    }
    else {
      input.insertAdjacentElement(
        "afterend",
        button
      );
    }


    if (input.form) {
      input.form.addEventListener(
        "reset",
        () => {
          window.setTimeout(
            () => {
              setVisibility(
                input,
                button,
                false
              );
            },
            0
          );
        }
      );
    }
  }


  function scan(root) {
    if (
      root instanceof
      HTMLInputElement
    ) {
      enhance(root);
    }

    if (
      !root ||
      typeof root.querySelectorAll !==
        "function"
    ) {
      return;
    }

    root
      .querySelectorAll(
        'input[type="password"]'
      )
      .forEach(
        enhance
      );
  }


  addStyles();
  scan(document);


  const observer =
    new MutationObserver(
      mutations => {
        for (
          const mutation of
          mutations
        ) {
          for (
            const node of
            mutation.addedNodes
          ) {
            if (
              node.nodeType ===
              Node.ELEMENT_NODE
            ) {
              scan(node);
            }
          }
        }
      }
    );


  observer.observe(
    document.documentElement,
    {
      childList: true,
      subtree: true
    }
  );
})();
