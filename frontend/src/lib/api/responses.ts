import { NextResponse } from "next/server";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiError = {
  success: false;
  error: {
    message: string;
  };
};

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>(
    { success: true, data },
    { status }
  );
}

export function apiError(message: string, status: number) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      error: { message },
    },
    { status }
  );
}
