"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const vm = require("node:vm");
const source = readFileSync(resolve(__dirname, "../script.js"), "utf8");

function setup({
  search = "",
  response = { ok: true, success: true },
  fail = false,
  invalid = false,
  delayed = false,
} = {}) {
  const listeners = {},
    navListeners = {},
    docListeners = {},
    toggleListeners = {};
  const label = { textContent: "Send project request" };
  const button = { disabled: false, querySelector: () => label };
  const classes = new Set();
  const form = {
    action: "https://api.web3forms.com/submit",
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    querySelector: () => button,
    reportValidity: () => !invalid,
    setAttribute: (k, v) => {
      form[k] = v;
    },
    removeAttribute: (k) => {
      delete form[k];
    },
    reset: () => {
      form.didReset = true;
    },
    classList: { add: (value) => classes.add(value) },
  };
  const message = {
    hidden: true,
    focus: () => {
      message.focused = true;
    },
  };
  const service = {
    options: [{ value: "" }, { value: "Network Installation" }],
    value: "",
  };
  const toggle = {
    attrs: { "aria-expanded": "false" },
    addEventListener: (type, fn) => {
      toggleListeners[type] = fn;
    },
    getAttribute: (k) => toggle.attrs[k],
    setAttribute: (k, v) => {
      toggle.attrs[k] = v;
    },
    focus: () => {
      toggle.focused = true;
    },
  };
  const navClasses = new Set();
  const nav = {
    addEventListener: (type, fn) => {
      navListeners[type] = fn;
    },
    classList: {
      toggle: (k, on) => (on ? navClasses.add(k) : navClasses.delete(k)),
    },
  };
  let calls = 0,
    request,
    release;
  const context = {
    document: {
      querySelector: () => toggle,
      querySelectorAll: () => [],
      getElementById: (id) =>
        ({
          "main-nav": nav,
          bookingForm: form,
          formMessage: message,
          serviceType: service,
        })[id],
      addEventListener: (type, fn) => {
        docListeners[type] = fn;
      },
    },
    window: { location: { search }, addEventListener: () => {} },
    URLSearchParams,
    AbortSignal,
    FormData: class {
      *[Symbol.iterator]() {
        yield ["name", "Test"];
        yield ["service", service.value];
      }
    },
    fetch: async (url, opts) => {
      calls++;
      request = { url, opts };
      if (delayed)
        await new Promise((r) => {
          release = r;
        });
      if (fail) throw Error("network unavailable");
      return {
        ok: response.ok,
        json: async () => ({ success: response.success }),
      };
    },
  };
  vm.runInNewContext(source, context);
  return {
    form,
    message,
    service,
    classes,
    button,
    label,
    toggle,
    navClasses,
    submit: () => listeners.submit({ preventDefault() {} }),
    menuClick: () => toggleListeners.click(),
    escape: () => docListeners.keydown({ key: "Escape" }),
    calls: () => calls,
    request: () => request,
    release: () => release(),
  };
}

test("valid service is carried into booking; unknown values are ignored", () => {
  assert.equal(
    setup({ search: "?service=Network%20Installation" }).service.value,
    "Network Installation",
  );
  assert.equal(setup({ search: "?service=Unknown" }).service.value, "");
});
test("successful booking submits the form, shows confirmation and stays on page", async () => {
  const s = setup();
  await s.submit();
  assert.equal(s.calls(), 1);
  assert.equal(s.request().url, s.form.action);
  assert.equal(s.request().opts.method, "POST");
  assert.equal(s.form.didReset, true);
  assert.equal(s.classes.has("booking-complete"), true);
  assert.equal(s.message.className, "form-message success");
  assert.equal(s.message.hidden, false);
  assert.equal(s.message.focused, true);
  assert.equal(s.button.disabled, false);
  assert.equal(s.form["aria-busy"], undefined);
});
for (const [label, config] of [
  ["API rejection", { response: { ok: true, success: false } }],
  ["HTTP failure", { response: { ok: false, success: true } }],
  ["network failure", { fail: true }],
]) {
  test(`${label} preserves form data and allows retry`, async () => {
    const s = setup(config);
    await s.submit();
    assert.equal(s.form.didReset, undefined);
    assert.equal(s.classes.has("booking-complete"), false);
    assert.equal(s.message.className, "form-message error");
    assert.equal(s.message.hidden, false);
    assert.equal(s.message.focused, true);
    assert.equal(s.button.disabled, false);
    assert.equal(s.label.textContent, "Send project request");
  });
}
test("invalid forms do not submit", async () => {
  const s = setup({ invalid: true });
  await s.submit();
  assert.equal(s.calls(), 0);
});
test("repeated submission is blocked while a request is in flight", async () => {
  const s = setup({ delayed: true });
  const first = s.submit();
  await s.submit();
  assert.equal(s.calls(), 1);
  assert.equal(s.button.disabled, true);
  s.release();
  await first;
  assert.equal(s.button.disabled, false);
});
test("menu announces state and Escape closes it and restores focus", () => {
  const s = setup();
  s.menuClick();
  assert.equal(s.toggle.attrs["aria-expanded"], "true");
  assert.equal(s.navClasses.has("is-open"), true);
  s.escape();
  assert.equal(s.toggle.attrs["aria-expanded"], "false");
  assert.equal(s.navClasses.has("is-open"), false);
  assert.equal(s.toggle.focused, true);
});
