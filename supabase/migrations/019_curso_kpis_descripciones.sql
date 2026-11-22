-- ────────────────────────────────────────────────────────────
-- Curso de KPIs — descripciones de los capítulos 02–07
-- (redactadas a partir de la introducción de cada manual).
-- Idempotente: solo rellena las que están vacías.
-- ────────────────────────────────────────────────────────────

update modules m
set description = v.description
from (values
  (2, 'El presupuesto dice si has llegado, no por qué. Cómo leer el cumplimiento con calendario y en euros, y qué KPI mirar cuando no se alcanza.'),
  (3, 'Compararte con el año pasado solo sirve si los dos periodos son comparables. Cómo detectar lo que distorsiona el N-1 y aislarlo antes de leer el dato.'),
  (4, 'El tráfico es oportunidad, no venta. Cómo validar el conteo, ponerlo en contexto y llevarlo a la planificación.'),
  (5, 'Qué proporción de las visitas termina en compra. Del dato a la franja horaria, de la franja al comportamiento y del comportamiento al plan.'),
  (6, 'No mires cuánto vale la cesta, entiende de qué está hecha: UPT, PMU, mix y margen.'),
  (7, 'No se trata de vender más unidades, sino de construir mejor cada venta. Cómo leer el UPT y qué dice de la capacidad del equipo.')
) as v(order_index, description)
where m.order_index = v.order_index
  and m.is_bonus = false
  and m.description is null
  and m.course_id = (select id from courses where slug = 'curso-de-kpis');
