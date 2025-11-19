/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: ".",
    moduleFileExtensions: ["ts", "js", "json"],
    testMatch: ["<rootDir>/__test__/**/*.test.ts"],
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
    },
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
