import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

const CLOUDFLARE_BASICS = {
  overview: "Cloudflare is a global network designed to make everything you connect to the Internet secure, private, fast, and reliable.",
  coreServices: [
    {
      name: "Application Services",
      description: "CDN, WAF, DDoS protection, SSL/TLS, and performance optimization",
      useCase: "Protect and accelerate web applications"
    },
    {
      name: "Zero Trust (SASE)",
      description: "Access control, secure web gateway, CASB, and network security",
      useCase: "Secure access to applications and data"
    },
    {
      name: "Developer Platform",
      description: "Workers (serverless), Pages, R2 storage, D1 database, KV",
      useCase: "Build and deploy serverless applications"
    },
    {
      name: "Network Services",
      description: "DNS, WAF, Bot Management, Load Balancing",
      useCase: "Network infrastructure and security"
    }
  ],
  keyFacts: {
    globalNetwork: "330+ cities in 120+ countries",
    performance: "Average 30ms latency worldwide",
    security: "Blocks 180+ billion threats per day",
    reliability: "100% uptime SLA available"
  },
  gettingStarted: [
    "1. Create a free Cloudflare account",
    "2. Add your domain and change nameservers",
    "3. Configure DNS records",
    "4. Enable security features (WAF, SSL)",
    "5. Optimize performance (CDN, caching)"
  ]
};

export class FlareSecMCP extends McpAgent {
  server = new McpServer({
    name: "FlareSec Cloudflare Basics",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "get_cloudflare_basics",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(CLOUDFLARE_BASICS, null, 2),
          },
        ],
      })
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/mcp" || url.pathname.startsWith("/mcp/")) {
      return FlareSecMCP.serve("/mcp").fetch(request, env, ctx);
    }

    if (url.pathname === "/llms.txt") {
      return env.ASSETS.fetch(new URL("/llms.txt", request.url));
    }

    return env.ASSETS.fetch(request);
  },
};
