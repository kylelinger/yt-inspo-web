import { NextResponse } from "next/server";

export async function GET() {
  const adminKey = process.env.ADMIN_KEY;
  return NextResponse.json({
    hasAdminKey: !!adminKey,
    adminKeyLength: adminKey?.length || 0,
    adminKeyPreview: adminKey ? `${adminKey.substring(0, 2)}***` : null,
  });
}
