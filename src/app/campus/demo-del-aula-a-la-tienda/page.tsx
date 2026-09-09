'use client'

import '@/styles/academia.css'
import {
  AcademiaProvider,
  ModuleShell,
  ModuleBlock,
  LessonBlock,
  ExerciseHeader,
  SelfCheck,
  ScenarioExercise,
  Classify,
  Matching,
  Reflection,
  Quiz,
} from '@/components/campus/academia'

const MODULE_ID = 'del-aula-a-la-tienda'

const SECTIONS = [
  { id: 'b1', label: '01 · Lo que ocurre en una tienda' },
  { id: 'b2', label: '02 · Los primeros 30 días' },
  { id: 'b3', label: '03 · Normal vs. excelente' },
  { id: 'b4', label: '04 · Cómo se asciende' },
  { id: 'b5', label: '05 · El retail del futuro' },
  { id: 'b6', label: 'Repaso final' },
]

export default function DemoDelAulaALaTiendaPage() {
  return (
    <AcademiaProvider
      id={MODULE_ID}
      onComplete={() => {
        // Demo: en producción aquí se emite la certificación o se navega al siguiente módulo/curso.
        alert('Módulo completado — aquí se emitiría la certificación o se pasaría al siguiente contenido (demo).')
      }}
    >
      <ModuleShell
        courseLabel="Academia · Formación B2C"
        moduleTitle="Del aula a la tienda"
        kicker="Charla de empleabilidad"
        meta="5 lecciones · 1 repaso"
        title={
          <>
            Del aula <em>a la tienda</em>
          </>
        }
        lede="Lo que nadie te cuenta sobre trabajar en retail — con ejercicios para fijar cada idea."
        facts={[
          { value: '45 min', label: 'Duración' },
          { value: '5', label: 'Ejercicios' },
          { value: '80%', label: 'Para superar' },
        ]}
        sections={SECTIONS}
      >
        {/* BLOQUE 1 */}
        <ModuleBlock id="b1" label="Lo que ocurre en una tienda">
          <LessonBlock
            kicker="Lección 01"
            title="Lo que realmente ocurre en una tienda"
            paragraphs={[
              <>
                Cuando alguien que nunca ha trabajado en retail imagina el día a día de un vendedor, suele
                mencionar siempre lo mismo: <strong>cobrar, colocar, reponer, atender</strong>. No van mal
                encaminados, pero se quedan muy cortos.
              </>,
              'Una tienda es un entorno vivo donde convergen personas, emociones, decisiones y negocio. Cada interacción requiere: comunicación, psicología, resolución de problemas, gestión emocional, trabajo en equipo y visión de negocio.',
            ]}
            quote='"Los productos los venden las webs. Las experiencias las crean las personas."'
          />
          <ExerciseHeader kicker="Ejercicio 01 · Autoevaluación" title="¿Cuáles de estas competencias ya usas sin saberlo?" icon="autoevaluacion" />
          <SelfCheck
            blockId="b1"
            exerciseId="ej1"
            note="No puntúa — es para pararte a pensarlo"
            items={[
              { term: 'Comunicación', description: 'escuchar, transmitir y conectar con cada tipo de cliente' },
              { term: 'Psicología', description: 'entender motivaciones, miedos y necesidades no expresadas' },
              { term: 'Resolución de problemas', description: 'actuar con rapidez cuando algo no sale como estaba previsto' },
              { term: 'Gestión emocional', description: 'mantener la calma, la energía y la actitud positiva en todo momento' },
              { term: 'Trabajo en equipo', description: 'coordinarse y apoyarse para que el conjunto funcione mejor' },
              { term: 'Negocio', description: 'entender objetivos, márgenes y cómo cada acción impacta en resultados' },
            ]}
          />
        </ModuleBlock>

        <hr className="ltt-rule" />

        {/* BLOQUE 2 */}
        <ModuleBlock id="b2" label="Los primeros 30 días">
          <LessonBlock
            kicker="Lección 02"
            title="Los primeros 30 días y los errores que frenan carreras"
            paragraphs={[
              <>
                Un buen responsable no mira tus ventas en tus primeros 30 días. Mira algo más importante:{' '}
                <strong>
                  puntualidad y fiabilidad, actitud ante lo inesperado, curiosidad y ganas de aprender, cómo tratas a
                  clientes y compañeros
                </strong>
                .
              </>,
              'Y hay 5 errores que no son por incompetencia, sino por falta de información: esperar que te digan todo, no pedir feedback, hacer solo lo mínimo, pensar que vender es hablar, y creer que la experiencia llega sola.',
            ]}
          />
          <ExerciseHeader kicker="Ejercicio 02 · Escenario" title="Es tu segunda semana en la tienda" icon="escenario" />
          <ScenarioExercise
            blockId="b2"
            exerciseId="ej2"
            question='Un cliente llega enfadado: el producto que compró la semana pasada no funciona. Nadie te ha explicado el procedimiento de devoluciones para este caso concreto. ¿Qué haces?'
            options={[
              {
                text: 'Le dices que espere a que llegue tu responsable, sin intentar nada mientras tanto.',
                correct: false,
                feedback:
                  'Evitar el problema hasta que llegue tu responsable no resuelve nada — y es justo el error #1 de la charla: esperar que te digan todo.',
              },
              {
                text: 'Escuchas al cliente, le explicas que vas a averiguar la mejor solución y preguntas a un compañero o a tu responsable en el momento, delante de él si hace falta.',
                correct: true,
                feedback:
                  'Correcto — es exactamente lo que un responsable busca en tus primeros 30 días: actitud ante lo inesperado. No hace falta saberlo todo, hace falta buscar una solución con lo que tienes.',
              },
              {
                text: 'Le das tú mismo una solución que te parece razonable, sin preguntar a nadie, para no parecer inexperto.',
                correct: false,
                feedback: 'Inventar una respuesta sin preguntar es arriesgado — puede generar un problema mayor si la información no es correcta.',
              },
            ]}
          />
        </ModuleBlock>

        <hr className="ltt-rule" />

        {/* BLOQUE 3 */}
        <ModuleBlock id="b3" label="Normal vs. excelente">
          <LessonBlock
            kicker="Lección 03"
            title="Vendedor normal vs. vendedor excelente"
            paragraphs={['No es el don de gentes, ni la labia. Es una forma distinta de entender el rol.']}
          />
          <ExerciseHeader kicker="Ejercicio 03 · Clasificación" title="Clasifica cada comportamiento" icon="clasificacion" />
          <Classify
            blockId="b3"
            exerciseId="ej3"
            categories={[
              { value: 'normal', label: 'Normal' },
              { value: 'excelente', label: 'Excelente' },
            ]}
            items={[
              { id: 'i1', label: 'Escucha mucho', answer: 'excelente' },
              { id: 'i2', label: 'Espera a los clientes', answer: 'normal' },
              { id: 'i3', label: 'Propone mejoras', answer: 'excelente' },
              { id: 'i4', label: 'Vende productos', answer: 'normal' },
              { id: 'i5', label: 'Gestiona bien la queja', answer: 'excelente' },
              { id: 'i6', label: 'Evita el conflicto', answer: 'normal' },
            ]}
          />
        </ModuleBlock>

        <hr className="ltt-rule" />

        {/* BLOQUE 4 */}
        <ModuleBlock id="b4" label="Cómo se asciende">
          <LessonBlock
            kicker="Lección 04"
            title="Cómo se asciende y qué buscan realmente las empresas"
            paragraphs={[
              <>
                La trayectoria en retail es real y más rápida de lo que parece si sabes cómo funciona el sistema:{' '}
                <strong>Vendedor → Especialista → Responsable</strong>, o <strong>Manager → Director</strong>. Y más
                allá de la tienda: compras, logística, visual merchandising, e-commerce, marketing, RRHH, expansión,
                corporativo.
              </>,
              'Las empresas no contratan títulos, contratan personas — y valoran tres cosas en distinto momento del proceso.',
            ]}
          />
          <ExerciseHeader kicker="Ejercicio 04 · Emparejar" title="¿Qué te consigue cada nivel de la pirámide?" icon="emparejamiento" />
          <Matching
            blockId="b4"
            exerciseId="ej4"
            options={[
              { value: 'entrevista', label: 'Te consiguen la entrevista' },
              { value: 'trabajo', label: 'Te consigue el trabajo' },
              { value: 'promocion', label: 'Te consigue la promoción' },
            ]}
            rows={[
              { label: 'Conocimientos', answer: 'entrevista' },
              { label: 'Actitud', answer: 'trabajo' },
              { label: 'Aprendizaje continuo', answer: 'promocion' },
            ]}
          />
        </ModuleBlock>

        <hr className="ltt-rule" />

        {/* BLOQUE 5 */}
        <ModuleBlock id="b5" label="El retail del futuro">
          <LessonBlock
            kicker="Lección 05"
            title="El retail del futuro y la actividad final de la charla"
            paragraphs={[
              '"La tecnología sustituirá tareas. Pero seguirá necesitando personas capaces de conectar con personas." El sector cambia a una velocidad sin precedentes — IA, omnicanalidad, datos y experiencia de cliente.',
            ]}
          />
          <ExerciseHeader kicker="Ejercicio 05 · Reflexión" title="Actividad final (la misma de la charla)" icon="reflexion" />
          <Reflection
            blockId="b5"
            exerciseId="ej5"
            fields={[
              {
                id: 'r1',
                label: '¿Dónde quieres estar dentro de 5 años?',
                placeholder: 'No hace falta que sea preciso. Puede ser un rol, un sector, una sensación, un estilo de vida.',
              },
              { id: 'r2', label: '¿Qué deberías empezar a hacer mañana?', placeholder: 'Una sola cosa. Concreta. Alcanzable.' },
            ]}
          />
        </ModuleBlock>

        <hr className="ltt-rule" />

        {/* BLOQUE 6 · REPASO */}
        <ModuleBlock id="b6" label="Repaso final">
          <Quiz
            blockId="b6"
            exerciseId="test"
            pass={0.8}
            title="Tipo test — Del aula a la tienda"
            lede="8 preguntas sobre lo que acabas de ver. Necesitas un 80% para cerrar el módulo, y puedes corregir tantas veces como quieras."
            questions={[
              {
                id: 'q1',
                text: '¿Qué mira sobre todo un buen responsable en tus primeros 30 días?',
                answer: 'b',
                options: [
                  { value: 'a', label: 'Tus cifras de venta' },
                  { value: 'b', label: 'Cómo eres como persona y como profesional' },
                  { value: 'c', label: 'Cuántas horas extra haces' },
                ],
              },
              {
                id: 'q2',
                text: '¿Cuál de estas opciones NO es uno de los 5 errores que más frenan carreras en retail?',
                answer: 'c',
                options: [
                  { value: 'a', label: 'No pedir feedback' },
                  { value: 'b', label: 'Hacer solo lo mínimo' },
                  { value: 'c', label: 'Llegar puntual al trabajo' },
                ],
              },
              {
                id: 'q3',
                text: '¿Qué caracteriza a un vendedor excelente frente a uno normal?',
                answer: 'b',
                options: [
                  { value: 'a', label: 'Habla mucho y vende productos' },
                  { value: 'b', label: 'Escucha mucho y resuelve necesidades' },
                  { value: 'c', label: 'Espera a los clientes y ejecuta lo que le dicen' },
                ],
              },
              {
                id: 'q4',
                text: 'En el camino profesional de tienda, ¿qué viene justo después de "Vendedor"?',
                answer: 'b',
                options: [
                  { value: 'a', label: 'Director' },
                  { value: 'b', label: 'Especialista' },
                  { value: 'c', label: 'Responsable' },
                ],
              },
              {
                id: 'q5',
                text: 'Según la pirámide de lo que buscan las empresas, ¿qué te consigue la entrevista?',
                answer: 'c',
                options: [
                  { value: 'a', label: 'La actitud' },
                  { value: 'b', label: 'El aprendizaje continuo' },
                  { value: 'c', label: 'Los conocimientos' },
                ],
              },
              {
                id: 'q6',
                text: '¿Y qué es lo que te consigue la promoción?',
                answer: 'a',
                options: [
                  { value: 'a', label: 'El aprendizaje continuo' },
                  { value: 'b', label: 'La actitud' },
                  { value: 'c', label: 'Los conocimientos' },
                ],
              },
              {
                id: 'q7',
                text: 'Según "El retail del futuro", ¿qué papel juega la tecnología frente a las personas?',
                answer: 'b',
                options: [
                  { value: 'a', label: 'Sustituirá completamente a los vendedores' },
                  { value: 'b', label: 'Sustituirá tareas, pero seguirá necesitando personas que conecten con personas' },
                  { value: 'c', label: 'No tendrá impacto relevante en el sector' },
                ],
              },
              {
                id: 'q8',
                text: '¿Cuál de estos ámbitos del retail más allá de la tienda se menciona en la charla?',
                answer: 'a',
                options: [
                  { value: 'a', label: 'Visual Merchandising' },
                  { value: 'b', label: 'Ingeniería aeroespacial' },
                  { value: 'c', label: 'Auditoría fiscal externa' },
                ],
              },
            ]}
          />
        </ModuleBlock>
      </ModuleShell>
    </AcademiaProvider>
  )
}
