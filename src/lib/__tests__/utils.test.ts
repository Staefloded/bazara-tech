import { cn } from "../utils";

describe("Utils", () => {
  describe("cn function", () => {
    it("should merge class names", () => {
      const result = cn("class1", "class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", true && "active", false && "hidden");
      expect(result).toBe("base active");
    });

    it("should filter out falsy values", () => {
      const result = cn("base", null, undefined, "", "valid");
      expect(result).toBe("base valid");
    });

    it("should handle objects with boolean values", () => {
      const result = cn({ active: true, disabled: false });
      expect(result).toBe("active");
    });

    it("should handle Tailwind class conflicts", () => {
      const result = cn("px-4", "px-6");
      expect(result).toBe("px-6");
    });
  });
});
