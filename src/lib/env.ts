/**
 * Lee una variable de entorno saneada. Quita el BOM (U+FEFF) y espacios/saltos
 * de línea: pegar un valor desde Windows en el panel de Vercel puede dejar un BOM
 * delante, y eso rompe cabeceras HTTP ("Cannot convert argument to a ByteString").
 */
export function cleanEnv(value: string | undefined): string | undefined {
  if (value == null) return undefined
  const v = value.replace(/^﻿+/, '').trim()
  return v === '' ? undefined : v
}

export function env(name: string): string | undefined {
  return cleanEnv(process.env[name])
}
