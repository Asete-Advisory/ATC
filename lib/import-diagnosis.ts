/**
 * Pontuação do Diagnóstico de Importação (/diagnostico).
 *
 * Perfis: 0 Explorador · 1 Otimizador · 2 Construtor de Marca · 3 Alta Escala.
 * Cada linha corresponde a uma pergunta e cada posição à opção escolhida
 * (mesma ordem de `copy[lang].diagnosis.questions[n].options`).
 */
export type ProfileIndex = 0 | 1 | 2 | 3;

export const DIAGNOSIS_QUESTION_COUNT = 4;

const answerProfiles: ProfileIndex[][] = [
  // 1. Expectativa: margem · exclusividade · escala · avaliando
  [1, 2, 3, 0],
  // 2. Ganho/receio: lucratividade · marca própria · competitividade · diversificação
  [1, 2, 3, 0],
  // 3. Meta 12 meses: começar do zero · otimizar · OEM · entender o mercado
  [0, 1, 2, 0],
  // 4. Porte: teste · médio recorrente · FCL · sem orçamento
  [0, 1, 3, 0],
];

// Em empate, vale o perfil indicado pela meta (3), depois porte (4),
// motivação (1) e ganho/receio (2).
const tieBreakQuestions = [2, 3, 0, 1];

export function resolveImporterProfile(answers: readonly number[]): ProfileIndex {
  const scores = [0, 0, 0, 0];

  answers.forEach((answer, question) => {
    const profile = answerProfiles[question]?.[answer];
    if (profile !== undefined) scores[profile] += 1;
  });

  const best = Math.max(...scores);

  for (const question of tieBreakQuestions) {
    const profile = answerProfiles[question]?.[answers[question]];
    if (profile !== undefined && scores[profile] === best) return profile;
  }

  return 0;
}
