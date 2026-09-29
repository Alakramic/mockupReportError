import { NextRequest, NextResponse } from 'next/server';
import db, { PC, Ticket } from '@/lib/db';

const VALID_AULAS = ['201', '202', '203', '301', '302', '303'];

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM tickets ORDER BY creado_en DESC LIMIT 20');
    const tickets = stmt.all() as Ticket[];
    return NextResponse.json(tickets, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Error al obtener tickets.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Cuerpo de solicitud inválido o vacío.' },
        { status: 400 }
      );
    }

    const { pcId, aula, falla, simularFalloRed } = body;

    // Artificial network delay simulation for realistic UI loading states (350ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Network failure injection switch
    if (simularFalloRed === true) {
      return NextResponse.json(
        { error: 'No se pudo conectar al servidor central de laboratorios.' },
        { status: 503 }
      );
    }

    // Poka-Yoke Input Validation
    if (!pcId || typeof pcId !== 'string' || pcId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Identificador de equipo (pcId) es requerido.' },
        { status: 400 }
      );
    }

    if (!aula || typeof aula !== 'string' || !VALID_AULAS.includes(aula.trim())) {
      return NextResponse.json(
        { error: `Aula inválida o no especificada. Aulas válidas: ${VALID_AULAS.join(', ')}.` },
        { status: 400 }
      );
    }

    if (!falla || typeof falla !== 'string' || falla.trim().length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar o especificar el tipo de avería.' },
        { status: 400 }
      );
    }

    const sanitizedPcId = pcId.trim();
    const sanitizedAula = aula.trim();
    const sanitizedFalla = falla.trim();

    // Verify that the PC exists in the DB and matches the classroom
    const checkStmt = db.prepare('SELECT * FROM pcs WHERE id = ?');
    const existingPc = checkStmt.get(sanitizedPcId) as PC | undefined;

    if (!existingPc) {
      return NextResponse.json(
        { error: `El equipo ${sanitizedPcId} no existe en el registro.` },
        { status: 400 }
      );
    }

    if (existingPc.aula !== sanitizedAula) {
      return NextResponse.json(
        { error: `El equipo ${sanitizedPcId} no pertenece al aula ${sanitizedAula}.` },
        { status: 400 }
      );
    }

    // Generate Ticket ID: #TK-{random 3 digits} (e.g. #TK-881)
    const randomNum = Math.floor(100 + Math.random() * 900);
    const ticketId = `#TK-${randomNum}`;
    const now = new Date();
    const hora = now.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Execute atomic transaction: insert ticket + update PC status to AVERÍA_REPORTADA
    const reportTx = db.transaction((tId: string, pId: string, room: string, defect: string) => {
      db.prepare(`
        INSERT INTO tickets (id, pc_id, aula, falla, creado_en)
        VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
      `).run(tId, pId, room, defect);

      db.prepare(`
        UPDATE pcs 
        SET estado = 'AVERÍA_REPORTADA' 
        WHERE id = ?
      `).run(pId);
    });

    reportTx(ticketId, sanitizedPcId, sanitizedAula, sanitizedFalla);

    return NextResponse.json(
      {
        success: true,
        ticket: {
          id: ticketId,
          pcId: sanitizedPcId,
          aula: sanitizedAula,
          falla: sanitizedFalla,
          hora,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error procesando reporte:', error);
    return NextResponse.json(
      { error: 'Error interno en el servidor al registrar el reporte.' },
      { status: 500 }
    );
  }
}