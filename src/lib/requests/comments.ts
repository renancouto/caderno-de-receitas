/** Comments the workflow writes, in Portuguese. */

export function conversionsComment(conversions: string[]): string {
  if (conversions.length === 0) return "Nenhuma conversão de unidade foi estimada.";
  return ["Conversões estimadas, confira:", "", ...conversions.map((c) => `- ${c}`)].join("\n");
}

export function pullRequestBody(issueNumber: number): string {
  return [
    `Closes #${issueNumber}`,
    "",
    "Receita criada a partir do pedido pelo modelo gratuito.",
  ].join("\n");
}

export type Failure =
  | { kind: "quota" | "unavailable"; detail: string }
  | { kind: "rules"; problems: string[] }
  | { kind: "empty" };

export function failureComment(failure: Failure): string {
  switch (failure.kind) {
    case "quota":
      return [
        "Não consegui criar a receita: o limite gratuito do modelo acabou por hoje (ele volta à meia-noite, horário do Pacífico).",
        "Nenhum pull request foi aberto. Tente de novo mais tarde.",
        "",
        `Detalhe: \`${failure.detail}\``,
      ].join("\n");
    case "unavailable":
      return [
        "Não consegui criar a receita: o modelo não respondeu.",
        "Nenhum pull request foi aberto. Tente de novo mais tarde.",
        "",
        `Detalhe: \`${failure.detail}\``,
      ].join("\n");
    case "rules":
      return [
        "Não consegui criar a receita: a resposta do modelo não segue as regras de receita.",
        "Nenhum pull request foi aberto. Problemas encontrados:",
        "",
        ...failure.problems.map((p) => `- ${p}`),
      ].join("\n");
    case "empty":
      return "O pedido está vazio: escreva a receita no texto do pedido. Nenhum pull request foi aberto.";
  }
}
