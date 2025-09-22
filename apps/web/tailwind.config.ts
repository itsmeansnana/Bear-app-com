/** @type {import('next').NextConfig} */
const nextConfig = {
experimental: { serverActions: { allowedOrigins: ["*"] } },
images: { remotePatterns: [] }
};
module.exports = nextConfig; type { Config } from "tailwindcss";


const config: Config = {
content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.{css}", "./pages/**/*.{ts,tsx}"],
theme: {
extend: {
colors: {
bg: "#0e1116",
card: "#161a22",
card2: "#11151c",
border: "#252a34",
limey: "#c6ff00",
muted: "#a3aab7"
},
boxShadow: {
soft: "0 10px 30px rgba(0,0,0,.35)"
}
}
},
plugins: []
};
export default config;
