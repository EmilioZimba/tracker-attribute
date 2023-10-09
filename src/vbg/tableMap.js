import { Link } from "@mui/material";

let tableMap = {
  de_XNRJPcjqgGr: {
    id: "de_XNRJPcjqgGr",
    label: "Tipo de Rastreio",
    hide: false,
    dimentionType: "de",
  },
  de_rey0Vhsno3B: {
    id: "de_rey0Vhsno3B",
    label: "Cod. Unico",
    hide: false,
    dimentionType: "de",
  },
  de_IrlIZ5JW6AV: {
    id: "de_IrlIZ5JW6AV",
    label: "F. Rastreio",
    hide: false,
    dimentionType: "de",
    render: (row) => {
      if (row["de_IrlIZ5JW6AV"].trim().length > 3)
        return (
          <Link
            href={`https://dhis2-passos.fhi360.org/api/35/events/files?dataElementUid=IrlIZ5JW6AV&eventUid=${row["psi"]}`}
            target="_blank"
          >
            mostrar
          </Link>
        );
      else {
        return "";
      }
    },
  },
  de_cIenUnctWKo: {
    id: "de_cIenUnctWKo",
    label: "Bateu-te, chutou-te, \ndeu-te chapadas, ou \nferiu-te fisicamente?",
    hide: true,
    dimentionType: "de",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        checked={row["de_cIenUnctWKo"].includes("1")}
      />
    ),
  },
  de_rRSaKbdUGfR: {
    id: "de_rRSaKbdUGfR",
    label:
      "Tocou nas suas partes íntimas, \nforçou-te fisicamente ou pressionou-te a \nter relações sexuais contra a sua vontade?",
    hide: true,
    dimentionType: "de",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        checked={row["de_rRSaKbdUGfR"].includes("1")}
      />
    ),
  },
  de_Wsx3pzvlMNZ: {
    id: "de_Wsx3pzvlMNZ",
    label: "Ameaçou-te, humilhou-te ou\n o fez ter medo dele?",
    hide: true,
    dimentionType: "de",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["de_Wsx3pzvlMNZ"].includes("1")}
      />
    ),
  },
  de_EKvOfnV9ZWK: {
    id: "de_EKvOfnV9ZWK",
    label:
      "Impediu-te de ir à US, \ntomar a sua medicação ou \nfazer algum tratamento para a sua saúde?",
    hide: true,
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["de_EKvOfnV9ZWK"].includes("1")}
      />
    ),

    dimentionType: "de",
  },
  de_uPdgwcIrKZR: {
    id: "de_uPdgwcIrKZR",
    label:
      "Negou-te o acesso a recursos financeiros \n(não pagou, não deu dinheiro/mesada) \ncomo forma de abuso ou controlo ou para a isolar \nou para impor outras consequências adversas ao seu bem-estar?",
    hide: true,
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["de_uPdgwcIrKZR"].includes("1")}
      />
    ),

    dimentionType: "de",
  },
  de_ZXPPkHzOCrd: {
    id: "de_ZXPPkHzOCrd",
    label: "G. Ref.",
    hide: false,
    dimentionType: "de",
    render: (row) => {
      return (
        row["de_ZXPPkHzOCrd"].length > 0 && (
          <Link
            href={`https://dhis2-passos.fhi360.org/api/35/events/files?dataElementUid=ZXPPkHzOCrd&eventUid=${row["psi"]}`}
            target="_blank"
          >
            mostrar
          </Link>
        )
      );
    },
  },
  pi_nIvgH253IDE: {
    id: "pi_nIvgH253IDE",
    label: "Positivos para VBG",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["pi_nIvgH253IDE"].includes("1")}
      />
    ),

    hide: false,
    dimentionType: "pi",
  },
  pi_StXObcveO9A: {
    id: "pi_StXObcveO9A",
    label: "V. Economica",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        readOnly
        name="vehicle1"
        checked={row["pi_StXObcveO9A"].includes("1")}
      />
    ),

    hide: false,
    dimentionType: "pi",
  },
  pi_vtQJk9qTLPe: {
    id: "pi_vtQJk9qTLPe",
    label: "V. Sexual",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["pi_vtQJk9qTLPe"].includes("1")}
      />
    ),

    hide: false,
    dimentionType: "pi",
  },
  pi_mldOO49REgB: {
    id: "pi_mldOO49REgB",
    label: "V. Psicologica",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["pi_mldOO49REgB"].includes("1")}
      />
    ),

    hide: false,
    dimentionType: "pi",
  },
  pi_gssQI9ZpwUB: {
    id: "pi_gssQI9ZpwUB",
    label: "V. Fisica",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["pi_gssQI9ZpwUB"].includes("1")}
      />
    ),
    hide: false,
    dimentionType: "pi",
  },

  de_onYTFbzwqfh: {
    id: "de_onYTFbzwqfh",
    label: "Apoio Psicossocial",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["de_onYTFbzwqfh"].includes("1")}
      />
    ),
    hide: false,
    dimentionType: "de",
  },

  de_TobTikW6GEu: {
    id: "de_TobTikW6GEu",
    label: "CE",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["de_TobTikW6GEu"].includes("1")}
      />
    ),
    hide: false,
    dimentionType: "de",
  },

  de_DEwuMVne5OY: {
    id: "de_DEwuMVne5OY",
    label: "PRM",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["de_DEwuMVne5OY"].includes("1")}
      />
    ),
    hide: false,
    dimentionType: "de",
  },

  de_VIVLD6MPd4z: {
    id: "de_VIVLD6MPd4z",
    label: "IPAJ",
    render: (row) => (
      <input
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
        readOnly
        checked={row["de_VIVLD6MPd4z"].includes("1")}
      />
    ),

    hide: false,
    dimentionType: "de",
  },

  de_oaLKdldEkB5: {
    id: "de_oaLKdldEkB5",
    label: "Para-legal",
    render: (row) => (
      <input
        type="checkbox"
        id="oaLKdldEkB5"
        name="oaLKdldEkB5"
        readOnly
        checked={row["de_oaLKdldEkB5"].includes("1")}
      />
    ),
    hide: false,
    dimentionType: "de",
  },

  de_anzEIWo2yyl: {
    id: "de_anzEIWo2yyl",
    label: "PPE",
    render: (row) => (
      <input
        type="checkbox"
        id="oaLKdldEkB5"
        name="oaLKdldEkB5"
        readOnly
        checked={row["de_anzEIWo2yyl"].includes("1")}
      />
    ),
    hide: false,
    dimentionType: "de",
  },

  de_ZPQsuVvll2t: {
    id: "de_ZPQsuVvll2t",
    label: "T. ITS",
    render: (row) => (
      <input
        type="checkbox"
        id="oaLKdldEkB5"
        name="oaLKdldEkB5"
        readOnly
        checked={row["de_ZPQsuVvll2t"].includes("1")}
      />
    ),
    hide: false,
    dimentionType: "de",
  },

  de_NJMktFK6QHZ: {
    id: "de_NJMktFK6QHZ",
    label: "T. HIV",
    render: (row) => (
      <input
        type="checkbox"
        id="oaLKdldEkB5"
        name="oaLKdldEkB5"
        readOnly
        checked={row["de_NJMktFK6QHZ"].includes("1")}
      />
    ),
    hide: false,
    dimentionType: "de",
  },
  de_haO8lhazCUK: {
    id: "de_haO8lhazCUK",
    label: "Referido a US",
    render: (row) => (
      <input
        type="checkbox"
        id="oaLKdldEkB5"
        name="oaLKdldEkB5"
        readOnly
        checked={row["de_haO8lhazCUK"] !== ""}
      />
    ),
    hide: false,
    dimentionType: "de",
  },
};

export default tableMap;
