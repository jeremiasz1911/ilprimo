import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { exportBackup, importBackup } from "@/lib/backup-service";
import { getBackupFilename } from "@/lib/backup-validation";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const backup = await exportBackup();
    const filename = getBackupFilename();

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nie udało się utworzyć backupu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const result = await importBackup(body);

    return NextResponse.json({
      success: true,
      message: `Przywrócono backup: ${result.pageSections} sekcji, ${result.categories} kategorii, ${result.dishes} dań.`,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nie udało się zaimportować backupu.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
