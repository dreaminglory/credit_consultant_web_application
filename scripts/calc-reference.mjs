// Writes docs/calculators-reference.xml (Excel 2003 SpreadsheetML, opens in Excel, LibreOffice
// and Google Sheets) from src/lib/calc/reference-cases.json — the same cases the unit tests use.
// Each sheet recomputes the cases with Excel's own PMT / PV / RATE next to the site's values and
// marks every pair OK or РАЗЛИКА, so anyone can check the calculators to the cent (FR-21).
// Usage: npm run calc:reference
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const cases = JSON.parse(
  await readFile(path.join(root, "src/lib/calc/reference-cases.json"), "utf8"),
);

const MONEY = 0.005;
const RATE = 0.0001;

/**
 * Sheet definitions. Inputs become columns; each output has an Excel formula written with
 * {input} and {=output} placeholders (another output's Excel column) and a tolerance.
 */
const sheets = [
  {
    key: "monthlyPayment",
    name: "Месечна вноска",
    inputs: { amount: "Сума (€)", years: "Срок (г.)", ratePct: "Лихва (%)" },
    outputs: [
      ["payment", "Вноска", "ROUND(PMT({ratePct}/1200,{years}*12,-{amount}),2)", MONEY],
      ["totalPaid", "Общо платено", "ROUND({=payment}*{years}*12,2)", MONEY],
      ["totalInterest", "Обща лихва", "ROUND(MAX({=totalPaid}-{amount},0),2)", MONEY],
    ],
  },
  {
    key: "refinance",
    name: "Рефинансиране",
    inputs: {
      balance: "Остатък (€)",
      years: "Оставащ срок (г.)",
      currentRatePct: "Сегашна лихва (%)",
      newRatePct: "Нова лихва (%)",
      switchingCosts: "Разходи (€)",
    },
    outputs: [
      [
        "currentPayment",
        "Сегашна вноска",
        "ROUND(PMT({currentRatePct}/1200,{years}*12,-{balance}),2)",
        MONEY,
      ],
      ["newPayment", "Нова вноска", "ROUND(PMT({newRatePct}/1200,{years}*12,-{balance}),2)", MONEY],
      ["monthlySaving", "Спестяване на месец", "ROUND({=currentPayment}-{=newPayment},2)", MONEY],
      [
        "netSaving",
        "Нетно спестяване",
        "ROUND({=monthlySaving}*{years}*12-{switchingCosts},2)",
        MONEY,
      ],
      [
        "breakEvenMonth",
        "Изплаща се за (мес.)",
        'IF({=monthlySaving}>0,IF(MAX(1,CEILING(ROUND({switchingCosts}/{=monthlySaving},2),1))<={years}*12,MAX(1,CEILING(ROUND({switchingCosts}/{=monthlySaving},2),1)),"—"),"—")',
        0,
      ],
    ],
  },
  {
    key: "maxLoanByIncome",
    name: "По доход",
    inputs: {
      netIncome: "Нетен доход (€)",
      otherPayments: "Други вноски (€)",
      years: "Срок (г.)",
      ratePct: "Лихва (%)",
      dstiMax: "Лимит DSTI",
      maxYears: "Макс. срок (г.)",
    },
    outputs: [
      ["years", "Срок след лимита", "MIN({years},{maxYears})", 0],
      [
        "maxPayment",
        "Макс. вноска",
        "MAX(ROUND({netIncome}*{dstiMax}-{otherPayments},2),0)",
        MONEY,
      ],
      ["maxLoan", "Макс. кредит", "ROUND(PV({ratePct}/1200,{=years}*12,-{=maxPayment}),2)", MONEY],
    ],
  },
  {
    key: "maxLoanByPayment",
    name: "Според вноската",
    inputs: { payment: "Вноска (€)", years: "Срок (г.)", ratePct: "Лихва (%)" },
    outputs: [["maxLoan", "Кредит", "ROUND(PV({ratePct}/1200,{years}*12,-{payment}),2)", MONEY]],
  },
  {
    key: "currentRate",
    name: "Текуща лихва",
    inputs: { balance: "Остатък (€)", payment: "Вноска (€)", years: "Оставащ срок (г.)" },
    outputs: [["ratePct", "Годишна лихва (%)", "RATE({years}*12,-{payment},{balance})*1200", RATE]],
  },
  {
    key: "loanCost",
    name: "Цена и ГПР",
    inputs: {
      amount: "Сума (€)",
      years: "Срок (г.)",
      ratePct: "Лихва (%)",
      upfrontFeePct: "Такса отпускане (%)",
      monthlyFee: "Месечна такса (€)",
      annualInsurance: "Застраховка годишно (€)",
    },
    outputs: [
      ["payment", "Вноска", "ROUND(PMT({ratePct}/1200,{years}*12,-{amount}),2)", MONEY],
      [
        "monthlyOutflow",
        "Общо на месец",
        "ROUND({=payment}+{monthlyFee}+{annualInsurance}/12,2)",
        MONEY,
      ],
      [
        "totalInterest",
        "Обща лихва",
        "ROUND(MAX(ROUND({=payment}*{years}*12,2)-{amount},0),2)",
        MONEY,
      ],
      [
        "totalFees",
        "Такси",
        "ROUND(ROUND({amount}*{upfrontFeePct}/100,2)+{monthlyFee}*{years}*12,2)",
        MONEY,
      ],
      ["totalInsurance", "Застраховки", "ROUND({annualInsurance}/12*{years}*12,2)", MONEY],
      [
        "totalCost",
        "Общо платено",
        "ROUND(ROUND({=payment}*{years}*12,2)+{=totalFees}+{=totalInsurance},2)",
        MONEY,
      ],
      [
        "aprPct",
        "ГПР (%)",
        "((1+RATE({years}*12,-({=payment}+{monthlyFee}+{annualInsurance}/12),{amount}-ROUND({amount}*{upfrontFeePct}/100,2)))^12-1)*100",
        RATE,
      ],
    ],
  },
];

const esc = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const cell = (value, style) => {
  const s = style ? ` ss:StyleID="${style}"` : "";
  if (value === null || value === undefined)
    return `<Cell${s}><Data ss:Type="String">—</Data></Cell>`;
  if (typeof value === "number") return `<Cell${s}><Data ss:Type="Number">${value}</Data></Cell>`;
  return `<Cell${s}><Data ss:Type="String">${esc(value)}</Data></Cell>`;
};
const formula = (f, style) =>
  `<Cell${style ? ` ss:StyleID="${style}"` : ""} ss:Formula="=${esc(f)}"/>`;

function sheetXml(sheet) {
  const inputKeys = Object.keys(sheet.inputs);
  // Columns: inputs, then per output [Excel, Site, Check]. R1C1 columns are 1-based.
  const inputCol = Object.fromEntries(inputKeys.map((k, i) => [k, i + 1]));
  const excelCol = Object.fromEntries(
    sheet.outputs.map(([k], i) => [k, inputKeys.length + 1 + i * 3]),
  );
  const ref = (f) =>
    f
      .replace(/\{=(\w+)\}/g, (_, k) => `RC${excelCol[k]}`)
      .replace(/\{(\w+)\}/g, (_, k) => `RC${inputCol[k]}`);

  const header = [
    ...inputKeys.map((k) => cell(sheet.inputs[k], "head")),
    ...sheet.outputs.flatMap(([, label]) => [
      cell(`${label} · Excel`, "head"),
      cell(`${label} · сайт`, "head"),
      cell("Проверка", "head"),
    ]),
  ];

  const rows = cases[sheet.key].map(({ input, expected }) => {
    const cells = [
      ...inputKeys.map((k) => cell(input[k])),
      ...sheet.outputs.flatMap(([key, , f, tol]) => {
        const check =
          `IF(AND(ISNUMBER(RC[-2]),ISNUMBER(RC[-1])),IF(ABS(RC[-2]-RC[-1])<=${tol},"OK","РАЗЛИКА"),` +
          `IF(RC[-2]&""=RC[-1]&"","OK","РАЗЛИКА"))`;
        return [formula(ref(f), "calc"), cell(expected[key], "calc"), formula(check, "check")];
      }),
    ];
    return `<Row>${cells.join("")}</Row>`;
  });

  return `<Worksheet ss:Name="${esc(sheet.name)}"><Table>${`<Column ss:Width="120"/>`.repeat(header.length)}<Row>${header.join("")}</Row>${rows.join("")}</Table></Worksheet>`;
}

const intro = `<Worksheet ss:Name="Как да проверите"><Table><Column ss:Width="720"/>${[
  "Еталон за калкулаторите на сайта (FR-21). Генерира се с npm run calc:reference — не редактирайте ръчно.",
  "Всеки лист пресмята същите примери с формулите на Excel (PMT, PV, RATE) и ги сравнява със стойностите на сайта.",
  "Колоната „Проверка“ трябва навсякъде да показва OK. РАЗЛИКА означава грешка в калкулатора.",
  "Вноските се закръглят до цент, както ги дават банките; общите суми се смятат от закръглената вноска.",
  "Лихвата и ГПР се сравняват с точност 0,0001 процентни пункта. ГПР: (1 + месечна вътрешна норма)^12 − 1 (Приложение 1 към ЗПК).",
]
  .map((line) => `<Row>${cell(line)}</Row>`)
  .join("")}</Table></Worksheet>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
<Style ss:ID="head"><Font ss:Bold="1"/><Interior ss:Color="#E9E2D4" ss:Pattern="Solid"/></Style>
<Style ss:ID="calc"><NumberFormat ss:Format="0.00####"/></Style>
<Style ss:ID="check"><Font ss:Bold="1"/></Style>
</Styles>
${intro}
${sheets.map(sheetXml).join("\n")}
</Workbook>
`;

const out = path.join(root, "docs/calculators-reference.xml");
await writeFile(out, xml);
console.log(`Wrote ${path.relative(root, out)} (${sheets.length} sheets)`);
