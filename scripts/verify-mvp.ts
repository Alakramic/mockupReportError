import { NextRequest } from 'next/server';
import db from '../lib/db';
import { GET as getPcs } from '../app/api/pcs/route';
import { POST as postReporte } from '../app/api/reportes/route';

async function runVerification() {
  console.log('====================================================');
  console.log('🚀 INICIANDO VERIFICACIÓN MULTI-ETAPA (MVP LAB 03)');
  console.log('====================================================\n');

  let passedTests = 0;
  const totalTests = 5;

  // ----------------------------------------------------
  // TEST 1: Database Consistency & Seeding (180 PCs)
  // ----------------------------------------------------
  console.log('🔹 TEST 1: Database Consistency & Seeding Verification');
  try {
    const totalPcs = db.prepare('SELECT COUNT(*) as count FROM pcs').get() as { count: number };
    const aulas = ['201', '202', '203', '301', '302', '303'];
    let roomCheckPassed = true;

    for (const aula of aulas) {
      const roomCount = db.prepare('SELECT COUNT(*) as count FROM pcs WHERE aula = ?').get(aula) as { count: number };
      if (roomCount.count !== 30) {
        console.error(`❌ Aula ${aula} tiene ${roomCount.count} PCs en lugar de 30.`);
        roomCheckPassed = false;
      }
    }

    if (totalPcs.count === 180 && roomCheckPassed) {
      console.log(`✅ TEST 1 PASÓ: Exactamente 180 PCs creadas distribuidas equitativamente en 6 aulas (30 c/u).\n`);
      passedTests++;
    } else {
      console.error(`❌ TEST 1 FALLÓ: Total de PCs en DB: ${totalPcs.count} (Esperado: 180).\n`);
    }
  } catch (err) {
    console.error('❌ Error en Test 1:', err);
  }

  // ----------------------------------------------------
  // TEST 2: Poka-Yoke Validation (HTTP 400 Rejections)
  // ----------------------------------------------------
  console.log('🔹 TEST 2: Poka-Yoke Validation Guards (Malformed / Missing Data)');
  try {
    // Malformed request 1: Missing falla
    const req1 = new NextRequest('http://localhost:3000/api/reportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pcId: 'PC-04-LAB302', aula: '302' }), // missing falla
    });
    const res1 = await postReporte(req1);

    // Malformed request 2: Invalid PC number (PC-99)
    const req2 = new NextRequest('http://localhost:3000/api/reportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pcId: 'PC-99-LAB302', aula: '302', falla: 'No enciende' }),
    });
    const res2 = await postReporte(req2);

    // Malformed request 3: Invalid Aula
    const req3 = new NextRequest('http://localhost:3000/api/reportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pcId: 'PC-04-LAB302', aula: '999', falla: 'No enciende' }),
    });
    const res3 = await postReporte(req3);

    if (res1.status === 400 && res2.status === 400 && res3.status === 400) {
      console.log('✅ TEST 2 PASÓ: Rechazo estricto con HTTP 400 ante datos faltantes, PC inexistente o aula inválida.\n');
      passedTests++;
    } else {
      console.error(`❌ TEST 2 FALLÓ: Códigos recibidos: [${res1.status}, ${res2.status}, ${res3.status}] (Esperado: 400, 400, 400).\n`);
    }
  } catch (err) {
    console.error('❌ Error en Test 2:', err);
  }

  // ----------------------------------------------------
  // TEST 3: Happy Path - Method 1 (PC-04-LAB302)
  // ----------------------------------------------------
  console.log('🔹 TEST 3: Happy Path Execution (Reporte PC-04 | Lab 302)');
  try {
    const req = new NextRequest('http://localhost:3000/api/reportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pcId: 'PC-04-LAB302',
        aula: '302',
        falla: 'No enciende',
      }),
    });
    const res = await postReporte(req);
    const body = await res.json();

    const isHttp200 = res.status === 200;
    const hasTicketStructure = body.success === true && body.ticket && body.ticket.id.startsWith('#TK-');
    
    // Check SQLite update
    const updatedPc = db.prepare('SELECT estado FROM pcs WHERE id = ?').get('PC-04-LAB302') as { estado: string };
    const ticketInDb = db.prepare('SELECT * FROM tickets WHERE pc_id = ?').get('PC-04-LAB302') as any;

    if (isHttp200 && hasTicketStructure && updatedPc.estado === 'AVERÍA_REPORTADA' && ticketInDb) {
      console.log(`✅ TEST 3 PASÓ: HTTP 200, Ticket ${body.ticket.id} generado, estado de PC actualizado a 'AVERÍA_REPORTADA' atómicamente.\n`);
      passedTests++;
    } else {
      console.error(`❌ TEST 3 FALLÓ: Status: ${res.status}, Ticket: ${JSON.stringify(body.ticket)}, DB Estado: ${updatedPc?.estado}.\n`);
    }
  } catch (err) {
    console.error('❌ Error en Test 3:', err);
  }

  // ----------------------------------------------------
  // TEST 4: Network Fault Injection (503 & Zero Corruption)
  // ----------------------------------------------------
  console.log('🔹 TEST 4: Network Fault Injection (simularFalloRed: true)');
  try {
    const ticketCountBefore = (db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number }).count;

    const req = new NextRequest('http://localhost:3000/api/reportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pcId: 'PC-05-LAB302',
        aula: '302',
        falla: 'Sin red / Internet',
        simularFalloRed: true,
      }),
    });
    const res = await postReporte(req);
    const ticketCountAfter = (db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number }).count;
    const pcStatus = (db.prepare('SELECT estado FROM pcs WHERE id = ?').get('PC-05-LAB302') as { estado: string }).estado;

    if (res.status === 503 && ticketCountBefore === ticketCountAfter && pcStatus === 'OPERATIVO') {
      console.log('✅ TEST 4 PASÓ: Error 503 retornado de inmediato y garantía de 0 tickets huérfanos/corruptos en la BD.\n');
      passedTests++;
    } else {
      console.error(`❌ TEST 4 FALLÓ: Status: ${res.status}, Tickets antes/después: ${ticketCountBefore}/${ticketCountAfter}, Estado PC: ${pcStatus}.\n`);
    }
  } catch (err) {
    console.error('❌ Error en Test 4:', err);
  }

  // ----------------------------------------------------
  // TEST 5: Method 2 Autocomplete & Room Query (?aula=301)
  // ----------------------------------------------------
  console.log('🔹 TEST 5: Method 2 Querying & Autocomplete (/api/pcs?aula=301)');
  try {
    const reqAula = new NextRequest('http://localhost:3000/api/pcs?aula=301');
    const resAula = await getPcs(reqAula);
    const pcsAula = await resAula.json();

    const reqSearch = new NextRequest('http://localhost:3000/api/pcs?q=PC-04');
    const resSearch = await getPcs(reqSearch);
    const pcsSearch = await resSearch.json();

    const aulaSuccess = resAula.status === 200 && Array.isArray(pcsAula) && pcsAula.length === 30;
    const searchSuccess = resSearch.status === 200 && Array.isArray(pcsSearch) && pcsSearch.length > 0 && pcsSearch.length <= 5;

    if (aulaSuccess && searchSuccess) {
      console.log(`✅ TEST 5 PASÓ: GET /api/pcs?aula=301 devolvió 30 PCs correctamente y autocomplete devolvió ${pcsSearch.length} coincidencias.\n`);
      passedTests++;
    } else {
      console.error(`❌ TEST 5 FALLÓ: Aula status: ${resAula.status} (length: ${pcsAula?.length}), Search status: ${resSearch.status} (length: ${pcsSearch?.length}).\n`);
    }
  } catch (err) {
    console.error('❌ Error en Test 5:', err);
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('====================================================');
  console.log(`📊 RESUMEN: ${passedTests}/${totalTests} PRUEBAS SUPERADAS SATISFACTORIAMENTE`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification().catch((e) => {
  console.error('Error fatal durante la verificación:', e);
  process.exit(1);
});