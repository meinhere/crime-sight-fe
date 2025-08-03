import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF files are allowed." },
        { status: 400 }
      );
    }
    const fileBuffer = await file.arrayBuffer();
    const fileName = `uploads/${Date.now()}-${file.name}`;

    await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(fileName, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    const { data: publicUrlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(fileName);

    return NextResponse.json(
      {
        message: "File uploaded successfully.",
        fileUrl: publicUrlData.publicUrl,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error uploading to Supabase Storage:", e);

    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
