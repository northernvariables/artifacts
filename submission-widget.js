(function() {
  // Provide safe defaults for global CAPTCHA tokens
  if (typeof window.__hcaptchaResponse === 'undefined') {
    window.__hcaptchaResponse = null;
  }
  if (typeof window.__turnstileToken === 'undefined') {
    window.__turnstileToken = null;
  }

  // API endpoints
  const SUBMIT_ENDPOINT = "https://api.northernvariables.ca/e45/submit";
  const CHECK_ENDPOINT = "https://api.northernvariables.ca/e45/check";

  function SubmissionApp() {
    const { useState, useEffect, useRef } = React;

    const [open, setOpen] = useState(false);
    const [kind, setKind] = useState("news");
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [duplicatedId, setDuplicatedId] = useState(null);
    const [checking, setChecking] = useState(false);

    const lastCheckRef = useRef(0);
    const openedTimeRef = useRef(0);

    // throttle open time
    useEffect(() => {
      if (open) {
        openedTimeRef.current = Date.now();
      }
    }, [open]);

    // duplicate check
    useEffect(() => {
      const trimmedUrl = url && url.trim();
      if (!trimmedUrl) {
        setDuplicatedId(null);
        return;
      }
      setChecking(true);
      const currentCheck = Date.now();
      lastCheckRef.current = currentCheck;
      fetch(CHECK_ENDPOINT + "?url=" + encodeURIComponent(trimmedUrl))
        .then((r) => r.json())
        .then((res) => {
          if (lastCheckRef.current !== currentCheck) return;
          if (res.duplicate) {
            setDuplicatedId(res.id);
          } else {
            setDuplicatedId(null);
          }
        })
        .catch(() => {
          if (lastCheckRef.current === currentCheck) {
            setDuplicatedId(null);
          }
        })
        .finally(() => {
          if (lastCheckRef.current === currentCheck) {
            setChecking(false);
          }
        });
    }, [url]);

    const canSubmit =
      !checking &&
      consent &&
      title.trim().length >= 8 &&
      title.trim().length <= 160 &&
      (!duplicatedId || (note && note.trim().length >= 15));

    function handleSubmit(e) {
      e.preventDefault();
      if (!canSubmit) return;
      const payload = {
        kind: kind,
        url: url || null,
        title: title,
        note: note || null,
        submitter: {
          name: name || null,
          email: email || null,
        },
        hp: "",
        hcaptchaToken: window.__hcaptchaResponse || null,
        turnstileToken: window.__turnstileToken || null,
      };
      fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.ok) {
            setOpen(false);
            setUrl("");
            setTitle("");
            setNote("");
            setName("");
            setEmail("");
            setConsent(false);
            setDuplicatedId(null);
            const msg = res.mergedInto
              ? "Thanks — your context was added to existing submission #" + res.mergedInto + "."
              : "Thanks! Your submission has been received.";
            alert(msg);
          } else {
            alert("Submission failed. Please try again.");
          }
        })
        .catch(() => {
          alert("Submission failed. Please try again.");
        });
    }

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "button",
        {
          onClick: () => setOpen(true),
          style: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          },
          className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg",
        },
        "Suggest update"
      ),
      open &&
        React.createElement(
          "div",
          {
            onClick: () => {
              if (Date.now() - openedTimeRef.current >= 1500) setOpen(false);
            },
            style: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            },
          },
          React.createElement(
            "div",
            {
              onClick: (e) => e.stopPropagation(),
              style: {
                maxWidth: "600px",
                margin: "60px auto",
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                overflowY: "auto",
                maxHeight: "80%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              },
            },
            React.createElement(
              "h2",
              { className: "text-xl font-bold mb-4" },
              "Suggest an update"
            ),
            React.createElement(
              "form",
              { onSubmit: handleSubmit, className: "space-y-4" },
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  { className: "block text-sm font-medium mb-1" },
                  "Type"
                ),
                React.createElement(
                  "select",
                  {
                    value: kind,
                    onChange: (e) => setKind(e.target.value),
                    className: "border rounded w-full p-2",
                  },
                  React.createElement("option", { value: "news" }, "News"),
                  React.createElement("option", { value: "update" }, "Update"),
                  React.createElement("option", { value: "correction" }, "Correction")
                )
              ),
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  { className: "block text-sm font-medium mb-1" },
                  "URL (optional)"
                ),
                React.createElement("input", {
                  type: "url",
                  value: url,
                  onChange: (e) => setUrl(e.target.value),
                  className: "border rounded w-full p-2",
                }),
                checking &&
                  React.createElement(
                    "p",
                    { className: "text-xs text-gray-500" },
                    "Checking for duplicates…"
                  ),
                !checking &&
                  duplicatedId &&
                  React.createElement(
                    "p",
                    { className: "text-xs text-red-600" },
                    "This link already exists as #",
                    duplicatedId,
                    ". Provide additional context to submit."
                  ),
                !checking &&
                  !duplicatedId &&
                  url &&
                  React.createElement(
                    "p",
                    { className: "text-xs text-green-600" },
                    "No existing item found for this link."
                  )
              ),
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  { className: "block text-sm font-medium mb-1" },
                  "Headline"
                ),
                React.createElement("input", {
                  type: "text",
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  className: "border rounded w-full p-2",
                  placeholder: "Enter a brief headline",
                })
              ),
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  { className: "block text-sm font-medium mb-1" },
                  "Details / context"
                ),
                React.createElement("textarea", {
                  value: note,
                  onChange: (e) => setNote(e.target.value),
                  className: "border rounded w-full p-2",
                  rows: 3,
                  placeholder: "Optional details",
                }),
                duplicatedId &&
                  (!note || note.trim().length < 15) &&
                  React.createElement(
                    "p",
                    { className: "text-xs text-red-600" },
                    "Please provide at least 15 characters of context to submit a duplicate link."
                  )
              ),
              React.createElement(
                "div",
                { className: "grid grid-cols-2 gap-4" },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "label",
                    { className: "block text-sm font-medium mb-1" },
                    "Name (optional)"
                  ),
                  React.createElement("input", {
                    type: "text",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    className: "border rounded w-full p-2",
                  })
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "label",
                    { className: "block text-sm font-medium mb-1" },
                    "Email (optional)"
                  ),
                  React.createElement("input", {
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    className: "border rounded w-full p-2",
                  })
                )
              ),
              React.createElement(
                "div",
                { className: "flex items-center" },
                React.createElement("input", {
                  type: "checkbox",
                  id: "consent",
                  checked: consent,
                  onChange: (e) => setConsent(e.target.checked),
                  className: "mr-2",
                }),
                React.createElement(
                  "label",
                  { htmlFor: "consent", className: "text-sm" },
                  "I consent to the processing and storage of this information."
                )
              ),
              React.createElement(
                "div",
                { className: "flex justify-end space-x-3 pt-2" },
                React.createElement(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (Date.now() - openedTimeRef.current >= 1500) setOpen(false);
                    },
                    className: "px-4 py-2 border rounded",
                  },
                  "Cancel"
                ),
                React.createElement(
                  "button",
                  {
                    type: "submit",
                    disabled: !canSubmit,
                    className:
                      "px-4 py-2 rounded text-white " +
                      (canSubmit
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"),
                  },
                  "Submit"
                )
              )
            )
          )
        )
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    const portal = document.getElementById("submission-portal");
    if (portal && !window.SubmissionAppMounted) {
      window.SubmissionAppMounted = true;
      ReactDOM.createRoot(portal).render(React.createElement(SubmissionApp));
    }
  });
})();
