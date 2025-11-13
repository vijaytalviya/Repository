import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill global TextEncoder/TextDecoder for Jest environment
Object.assign(global, { TextEncoder, TextDecoder });
