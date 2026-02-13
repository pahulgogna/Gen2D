import { NextResponse } from "next/server";

export function SendJsonResponse(status: number, data: any): NextResponse<any> {
  return NextResponse.json(data, {
    status: status,
  });
}

export function SendJsonError(
  status: number,
  data: any,
): NextResponse<{
  error: any;
}> {
  return NextResponse.json(
    {
      error: data,
    },
    {
      status: status,
    },
  );
}
