import { NextRequest, NextResponse } from "next/server";
import { LLMService } from "@/lib/llm-service";
import path from "path";
import fs from "fs";
import { executeQuery } from "@/lib/db";

// Cargar schema.sql como contexto
const schemaPath = path.resolve(process.cwd(), "schema.sql");
const schemaText = fs.readFileSync(schemaPath, "utf-8");

function isSafeSqlQuery(query: string): boolean {
    const lowered = query.trim().toLowerCase();
    // Solo permitir consultas SELECT
    return lowered.startsWith("select") &&
      !/\b(update|delete|insert|drop|alter|create|replace|truncate|grant|revoke|set|use|commit|rollback)\b/.test(lowered);
  }

export async function POST(req: NextRequest) {
  try {

    const { input } = await req.json();
    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Falta la entrada del usuario." }, { status: 400 });
    }

    // 1. Generar SQL a partir de la entrada del usuario
    const sqlGenRes = await LLMService.generate({
        input: `Solicitud del usuario: ${input}\nGenera una única consulta SQL (MySQL) para esta solicitud, SOLO devuelve la consulta SQL.`,
        instructions: `Eres un generador experto de consultas MySQL. Este es el esquema de base de datos que debes usar:\n\n${schemaText}\n\nGenera únicamente la consulta SQL, sin explicaciones ni formato adicional.
        REGLAS: 
        - Evita usar el ID en el SELECT.`
      });

      let sqlQuery = sqlGenRes.choices?.[0]?.message?.content?.trim() || sqlGenRes.output_text?.trim();
      console.log("SQL Query:", sqlQuery);
      if (!sqlQuery) {
        return NextResponse.json({ error: "No se generó una consulta SQL." }, { status: 400 });
      }
    // Eliminar formato de bloque de código Markdown si está presente
    sqlQuery = sqlQuery.replace(/^```[a-zA-Z]*\n?|```$/g, '').replace(/```[a-zA-Z]*([\s\S]*?)```/g, '$1').trim();
    console.log("Consulta SQL generada:", sqlQuery);
  
    // 2. Validar SQL con LLM
    const validateRes = await LLMService.generate({
        input: `Valida que la sintaxis de la consulta SQL sea correcta: ${sqlQuery}`,
        instructions: `Eres un validador de sintaxis para SQL. Responde únicamente TRUE o FALSE. Si la sintaxis es correcta, responde TRUE. Si la sintaxis es incorrecta, responde FALSE.`
      });
      let isValid = validateRes.choices?.[0]?.message?.content?.trim() || validateRes.output_text?.trim();
      console.log("SQL Query validada:", isValid);
      if (!isValid) {
        return NextResponse.json({ error: "La consulta SQL no es válida." }, { status: 400 });
      }

      // 3. Validar que sea un query seguro
      if (!isSafeSqlQuery(sqlQuery)) {
        return NextResponse.json({ error: "Validación personalizada fallida: solo se permiten consultas SELECT.", sql: sqlQuery }, { status: 400 });
      }

      // 4. Ejecutar la consulta
    let result;
    try {
      result = await executeQuery<any[]>(sqlQuery);
    } catch (err: any) {
      return NextResponse.json({ error: "Error al ejecutar la consulta SQL.", sql: sqlQuery, details: err.message }, { status: 400 });
    }

    return NextResponse.json({ sql: sqlQuery, result });
  
  } catch (error: any) {
    console.error("[API/openai] Unexpected API handler error", error);
    return NextResponse.json({ error: error.message || "Unknown error", stack: error.stack }, { status: 500 });
  }
}
