import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }
    
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ authenticated: false, role: null }, { status: 200 });
  }
}
