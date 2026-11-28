// Dados estruturados (schema.org em JSON-LD). Só entra o que está visível no site e é verdadeiro:
// nada de avaliações, notas ou números que a Polyana não tenha mostrado na página.
import { faq, links, site, spaces } from "./data/clinic";

export const SITE_URL = "https://www.paralaxes.com.br";

const ORG = `${SITE_URL}/#organizacao`;
const PESSOA = `${SITE_URL}/#polyana`;
const SITE = `${SITE_URL}/#site`;

export function jsonLd() {
  const grafo = [
    {
      "@type": "WebSite",
      "@id": SITE,
      url: `${SITE_URL}/`,
      name: site.name,
      inLanguage: "pt-BR",
      publisher: { "@id": ORG },
    },
    {
      "@type": "EducationalOrganization",
      "@id": ORG,
      name: site.name,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png`, width: 150, height: 150 },
      image: `${SITE_URL}/img/og-paralaxe.png`,
      description:
        "Grupo de estudos teóricos e supervisão clínica em grupo em psicanálise, on-line, para quem quer construir um percurso de formação: do texto teórico até a prática clínica.",
      founder: { "@id": PESSOA },
      areaServed: { "@type": "Country", name: "Brasil" },
      availableLanguage: "pt-BR",
      telephone: "+55 31 98497-6108",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "atendimento",
        telephone: "+55 31 98497-6108",
        availableLanguage: "pt-BR",
      },
      sameAs: [links.instagram, links.threads],
    },
    {
      "@type": "Person",
      "@id": PESSOA,
      name: site.organizer,
      url: `${SITE_URL}/`,
      worksFor: { "@id": ORG },
      sameAs: [links.instagramPolyana],
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#estudos`,
      name: spaces.estudos.name,
      serviceType: "Grupo de estudos teóricos de psicanálise",
      description: spaces.estudos.text,
      provider: { "@id": ORG },
      areaServed: { "@type": "Country", name: "Brasil" },
      availableChannel: { "@type": "ServiceChannel", serviceUrl: `${SITE_URL}/#espacos`, name: "On-line, pelo Google Meet" },
      offers: { "@type": "Offer", price: "80", priceCurrency: "BRL", description: "Contribuição mensal" },
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#escuta`,
      name: spaces.escuta.name,
      serviceType: "Supervisão psicanalítica em grupo",
      description: spaces.escuta.text,
      provider: { "@id": ORG },
      areaServed: { "@type": "Country", name: "Brasil" },
      availableChannel: { "@type": "ServiceChannel", serviceUrl: `${SITE_URL}/#espacos`, name: "On-line, pelo Google Meet" },
      offers: [
        { "@type": "Offer", name: "Ouvinte", price: "50", priceCurrency: "BRL" },
        { "@type": "Offer", name: "Analista", price: "90", priceCurrency: "BRL" },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#perguntas`,
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  // "<" escapado para o JSON nunca fechar a tag <script> por engano
  return JSON.stringify({ "@context": "https://schema.org", "@graph": grafo }).replace(/</g, "\\u003c");
}
