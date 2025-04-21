import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Twitter API v2 endpoint for user lookup
const TWITTER_API_URL = "https://api.twitter.com/2/users/by/username/ClusterProtocol";

export async function GET(request: Request) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request as any });
    
    if (!token || !token.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated with Twitter" },
        { status: 401 }
      );
    }

    // Fetch the Twitter ID for ClusterProtocol
    const response = await fetch(TWITTER_API_URL, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Twitter API error:", await response.text());
      return NextResponse.json(
        { error: "Failed to fetch Twitter ID" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      id: data.data?.id,
      username: data.data?.username 
    });
  } catch (error: any) {
    console.error("Error fetching Twitter ID:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
