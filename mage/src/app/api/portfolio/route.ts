// api/portfolio.ts
import axios from 'axios';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tickers = url.searchParams.get('tickers');

  if (!tickers) {
    return new Response('Ticker parameter is required', { status: 400 });
  }

  try {
    const response = await axios.get('http://192.168.231.182:8001/analyze_portfolio', {
      params: { tickers: tickers.toUpperCase() }, // Convert tickers to uppercase
    });

    return new Response(response.data, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response('Failed to fetch analysis', { status: 500 });
  }
}
