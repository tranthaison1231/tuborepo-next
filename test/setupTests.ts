import "vitest-axe/extend-expect";
import "vitest-dom/extend-expect";
import * as axeMatchers from "vitest-axe/matchers";
import * as domMatchers from "vitest-dom/matchers";
import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";

// @ts-ignore: @see https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

expect.extend(axeMatchers);
expect.extend(domMatchers);

afterEach(cleanup);
