import { render } from "../src";
import * as path from "path";
import { performance } from "perf_hooks";

describe("Performance testing", () => {
  const measurePerformance = (
    templatePath: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
    iterations: number
  ): number => {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      render(templatePath, data);
    }

    const end = performance.now();
    return (end - start) / iterations;
  };

  const measurePerformanceSingle = (
    templatePath: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>
  ): number => {
    const start = performance.now();
    render(templatePath, data);

    const end = performance.now();
    return end - start;
  };

  test("performance test for rendering large templates - average", () => {
    const templatePath = path.resolve(
      __dirname,
      "fixtures",
      "performanceFixture.html"
    );
    const iterations = 1000;
    const averageTime = measurePerformance(
      templatePath,
      { name: "Performance Test" },
      iterations
    );

    console.debug(
      `Average render time over ${iterations} iterations: ${averageTime.toFixed(
        2
      )} ms`
    );
    expect(averageTime).toBeLessThan(20);
  });

  test("performance test for rendering large template - single", () => {
    const templatePath = path.resolve(
      __dirname,
      "fixtures",
      "performanceFixtureSingle.html"
    );
    const rows = 10000;
    const renderTime = measurePerformanceSingle(templatePath, {
      name: "Performance Test",
      length: rows,
    });
    console.log(
      `Rendering one template with ${rows} rows took ${renderTime.toFixed(
        2
      )} ms`
    );
    expect(renderTime).toBeLessThan(20);
  });
});
