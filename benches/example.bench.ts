import { bench, describe } from "vitest";

describe("String operations", () => {
  bench("string concatenation", () => {
    let result = "";
    for (let i = 0; i < 1000; i++) {
      result += "test";
    }
  });

  bench("array join", () => {
    const arr = [];
    for (let i = 0; i < 1000; i++) {
      arr.push("test");
    }
    arr.join("");
  });

  bench("template literals", () => {
    let result = "";
    for (let i = 0; i < 1000; i++) {
      result = `${result}test`;
    }
  });
});

describe("Array operations", () => {
  const data = Array.from({ length: 1000 }, (_, i) => i);

  bench("for loop", () => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
  });

  bench("forEach", () => {
    let sum = 0;
    data.forEach((n) => {
      sum += n;
    });
  });

  bench("reduce", () => {
    data.reduce((acc, n) => acc + n, 0);
  });
});

describe("Object operations", () => {
  const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

  bench("Object.keys", () => {
    Object.keys(obj).length;
  });

  bench("Object.values", () => {
    Object.values(obj).length;
  });

  bench("Object.entries", () => {
    Object.entries(obj).length;
  });

  bench("for...in loop", () => {
    let count = 0;
    for (const key in obj) {
      count++;
    }
  });
});
