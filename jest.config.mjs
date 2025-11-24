/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: ".",
    moduleFileExtensions: ["ts", "js", "json"],
    testMatch: ["<rootDir>/test/**/*.test.ts"],
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
    },

    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["lcov", "text", "cobertura"],
    collectCoverageFrom: ["src/**/*.ts"],

    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
