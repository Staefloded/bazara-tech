import { buttonVariants } from "../ui/button";

describe("Button Integration Tests", () => {
  describe("buttonVariants function", () => {
    it("should generate correct classes for default variant", () => {
      const classes = buttonVariants();
      expect(classes).toContain("bg-primary");
      expect(classes).toContain("text-primary-foreground");
    });

    it("should generate correct classes for destructive variant", () => {
      const classes = buttonVariants({ variant: "destructive" });
      expect(classes).toContain("bg-destructive");
      expect(classes).toContain("text-white");
    });

    it("should generate correct classes for different sizes", () => {
      let classes = buttonVariants({ size: "sm" });
      expect(classes).toContain("h-8");
      expect(classes).toContain("px-3");

      classes = buttonVariants({ size: "lg" });
      expect(classes).toContain("h-10");
      expect(classes).toContain("px-6");
    });

    it("should combine variant and size classes correctly", () => {
      const classes = buttonVariants({ variant: "outline", size: "sm" });
      expect(classes).toContain("border");
      expect(classes).toContain("bg-background");
      expect(classes).toContain("h-8");
      expect(classes).toContain("px-3");
    });

    it("should include base classes", () => {
      const classes = buttonVariants();
      expect(classes).toContain("inline-flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("cursor-pointer");
    });

    it("should handle className prop correctly", () => {
      const classes = buttonVariants({ className: "custom-class" });
      expect(classes).toContain("custom-class");
    });
  });
});
