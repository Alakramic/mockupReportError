import { NextRequest, NextResponse } from 'next/server';
import db, { PC } from '@/lib/db';

const VALID_AULAS = ['201', '202', '203', '301', '302', '303'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const aula = searchParams.get('aula');
    const q = searchParams.get('q');

    // Case 1: Filter by classroom
    if (aula !== null) {
      const sanitizedAula = aula.trim();
      if (!VALID_AULAS.includes(sanitizedAula)) {
        return NextResponse.json(
          { error: `Aula inválida (${sanitizedAula}). Aulas permitidas: ${VALID_AULAS.join(', ')}` },
          { status: 400 }
        );
      }

      const stmt = db.prepare('SELECT id, aula, numero, estado FROM pcs WHERE aula = ? ORDER BY numero ASC');
      const pcs = stmt.all(sanitizedAula) as PC[];
      return NextResponse.json(pcs, { status: 200 });
    }

    // Case 2: Autocomplete query
    if (q !== null) {
      const sanitizedQuery = q.trim();
      if (sanitizedQuery.length === 0) {
        return NextResponse.json([], { status: 200 });
      }

      const stmt = db.prepare(`
        SELECT id, aula, numero, estado 
        FROM pcs 
        WHERE id LIKE ? OR aula LIKE ? 
        ORDER BY aula ASC, numero ASC 
        LIMIT 5
      `);
      const searchPattern = `%${sanitizedQuery}%`;
      const pcs = stmt.all(searchPattern, searchPattern) as PC[];
      return NextResponse.json(pcs, { status: 200 });
    }

    // Case 3: No filter specified -> return all PCs
    const stmt = db.prepare('SELECT id, aula, numero, estado FROM pcs ORDER BY aula ASC, numero ASC');
    const pcs = stmt.all() as PC[];
    return NextResponse.json(pcs, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching PCs:', error);
    return NextResponse.json(
      { error: 'Error interno al consultar los equipos de laboratorio.' },
      { status: 500 }
    );
  }
}