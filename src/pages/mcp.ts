import type { APIRoute } from 'astro';

interface JSONRPCRequest {
  jsonrpc: '2.0';
  method: string;
  params?: any;
  id?: string | number;
}

interface JSONRPCResponse {
  jsonrpc: '2.0';
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id?: string | number | null;
}

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

function handleRequest(request: JSONRPCRequest): JSONRPCResponse {
  const { method, params, id } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'flaresec-cloudflare-basics',
          version: '1.0.0'
        }
      },
      id
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      result: {
        tools: [
          {
            name: 'get_cloudflare_basics',
            description: 'Get comprehensive information about Cloudflare core services, capabilities, and getting started guide',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        ]
      },
      id
    };
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    
    if (toolName === 'get_cloudflare_basics') {
      return {
        jsonrpc: '2.0',
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(CLOUDFLARE_BASICS, null, 2)
            }
          ]
        },
        id
      };
    }

    return {
      jsonrpc: '2.0',
      error: {
        code: -32601,
        message: `Unknown tool: ${toolName}`
      },
      id
    };
  }

  return {
    jsonrpc: '2.0',
    error: {
      code: -32601,
      message: `Method not found: ${method}`
    },
    id
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: JSONRPCRequest = await request.json();
    const response = handleRequest(body);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error'
      },
      id: null
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  
  if (url.searchParams.get('sse') === 'true') {
    const sseResponse = {
      jsonrpc: '2.0',
      method: 'notifications/initialized',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'flaresec-cloudflare-basics',
          version: '1.0.0'
        }
      }
    };

    return new Response(`data: ${JSON.stringify(sseResponse)}\n\n`, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  }

  return new Response(JSON.stringify({
    name: 'flaresec-cloudflare-basics',
    version: '1.0.0',
    description: 'MCP server providing Cloudflare basics and fundamentals',
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: true
    },
    tools: [
      {
        name: 'get_cloudflare_basics',
        description: 'Get comprehensive information about Cloudflare core services'
      }
    ],
    usage: {
      transport: 'HTTP with JSON-RPC 2.0',
      endpoint: url.pathname,
      sse: `${url.pathname}?sse=true`
    }
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
